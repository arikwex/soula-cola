import * as bus from './bus';
import { retainTransform } from "./canvas";
import { add, remove } from "./engine";
import HexParticle from "./hex-particle";
import LetterParticle from "./letter-particle";

function Interaction() {
    let cx = 0;
    let cy = 0;
    let text = " ";
    let filledText = "";
    let numFilled = 0;
    let nextLetterText = "";
    let activeGateway = null;
    let anim = 0;
    let pulse = 100;
    const vOffset = -100;

    function render(ctx) {
        if (activeGateway == null) {
            return;
        }
        retainTransform(() => {
            ctx.font = "40px monospace";
            
            ctx.lineWidth = 10 + Math.exp(-pulse * 10) * 5;
            const L = 0 + Math.exp(-pulse * 20) * 200;
            ctx.strokeStyle = `rgb(${L},${L},${L})`;

            const textWidth = ctx.measureText(text).width;
            const xOffset = -textWidth / 2;
            ctx.strokeText(text, cx + xOffset, cy + vOffset);
            // Unfilled
            ctx.fillStyle = '#333';
            ctx.fillText(text, cx + xOffset, cy + vOffset);
            // Filled
            ctx.fillStyle = '#fff';
            ctx.fillText(filledText, cx + xOffset, cy + vOffset);
            // Next character blinker
            if ( Math.cos(anim * 20) > 0) {
                ctx.fillStyle = '#ff0';
                ctx.fillText(nextLetterText, cx + xOffset, cy + vOffset);
            }
        });
    }

    function updateFilledText() {
        let filledChars = text.split("");
        for (let i = numFilled; i < text.length; i++) {
            filledChars[i] = " ";
        }
        filledText = filledChars.join("");
        nextLetterText = [...new Array(numFilled).fill(" "), text[numFilled], ...new Array(text.length - numFilled - 1).fill(" ")].join("")
    }
    updateFilledText();

    function update(dT) {
        anim += dT;
        pulse += dT;
    }

    function setGateway(g) {
        if (g != null) {
            cx = g.getX();
            cy = g.getY();
            text = g.getCurrentWord();
            if (g != activeGateway) {
                updateFilledText();
            }
        } else {
            numFilled = 0;
            pulse = 100;
            updateFilledText();
        }
        activeGateway = g;
    }

    function onKeyDown(evt) {
        if (activeGateway == null) {
            return;
        }
        const charKey = evt.key.toUpperCase();
        const keyCode = evt.keyCode;
        if ((keyCode >= 65 && keyCode <= 90) || // A-Z
            (keyCode >= 97 && keyCode <= 122)) { // a-z
            if (text[numFilled]?.toUpperCase() == charKey) {
                bus.emit('interact-fill');
                numFilled += 1;
                pulse = 0;
                add(new LetterParticle(cx, cy, nextLetterText));
                if (numFilled == text.length) {
                    activeGateway.resolve();
                    SG = activeGateway;
                    setTimeout(() => {
                        bus.emit('consume', { gateway: SG, emote: SG.getEmote() });
                        add(new HexParticle(SG.getX(), SG.getY(), SG.getEmote()));
                        remove([SG]);
                    }, 500);
                    activeGateway = null;
                } else {
                    updateFilledText();
                }
            } else {
                bus.emit('interact-error');
                numFilled = 0;
                updateFilledText();
            }
        }
    }

    window.addEventListener('keydown', onKeyDown);
    function onRemove() {
        window.removeEventListener('keydown', onKeyDown);
    }

    return {
        update,
        render,
        setGateway,
        onRemove,
        tags: ['interaction'],
        order: 1000,
    };
}

export default Interaction;