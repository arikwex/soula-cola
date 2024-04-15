import * as bus from './bus';
import { retainTransform } from "./canvas";
import { BLUE, GRAY, GREEN, LIGHT_GRAY, ORANGE, PURPLE, RED, TAN, WHITE, YELLOW } from "./color";
import { EMOTE } from "./emote-enum";
import { add, remove } from './engine';
import HexParticle from "./hex-particle";

function Soda(cx, cy, challengeWord) {
    let self;
    let activeTimer = 0;
    let spawningAnim = 0;
    let resolved = false;

    function render(ctx) {
        retainTransform(() => {
            if (spawningAnim > 0.5) {
                // Gateway vis
                ctx.lineWidth = 5;
                
                // can here
                if (activeTimer > 0) {
                    ctx.strokeStyle = WHITE;
                } else {
                    ctx.strokeStyle = LIGHT_GRAY;
                }
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const dx = Math.cos(i/6*6.28) * 70;
                    const dy = Math.sin(i/6*6.28) * 70/2;
                    if (i == 0) ctx.moveTo(cx+dx, cy+dy);
                    else ctx.lineTo(cx+dx, cy+dy);
                }
                ctx.closePath();
                // ctx.moveTo(cx+55, cy);
                // ctx.ellipse(cx, cy, 55, 55/2, 0, 0, 6.28);
                ctx.stroke();
            }

            // Spawning-in animation
            if (spawningAnim < 1.0) {
                const S = 1.1 - 1.1 * Math.exp(-spawningAnim * 4);
                const H = 1 * Math.exp(-spawningAnim * 5) + 0.02;
                const alpha = Math.min(spawningAnim * 2, 1) * Math.min(Math.max(5 - spawningAnim * 5, 0), 1);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    const dx = Math.cos(i/6*6.28) * 70 * S;
                    const dy = Math.sin(i/6*6.28) * 70/2 * S;
                    const dx2 = Math.cos((i+1)/6*6.28) * 70 * S;
                    const dy2 = Math.sin((i+1)/6*6.28) * 70/2 * S;
                    ctx.moveTo(cx+dx, cy+dy);
                    ctx.lineTo(cx+dx2, cy+dy2);
                    ctx.lineTo(cx+dx2, cy+dy2-400 * H);
                    ctx.lineTo(cx+dx, cy+dy-400 * H);
                    ctx.fill();
                }
            }
        });
    }

    function update(dT) {
        activeTimer -= dT;
        spawningAnim += dT;
    }

    function inRegion(tx, ty) {
        const dx = tx - cx;
        const dy = ty - cy;
        return (spawningAnim > 1.0) && (dx * dx + (dy * dy) * 2 < 65 * 65);
    }

    function isTooCloseToGate(tx, ty) {
        const dx = tx - cx;
        const dy = ty - cy;
        return dx * dx + (dy * dy) * 2 < 130 * 130;
    }

    function refreshActive() {
        activeTimer = 0.2;
    }

    function getX() { return cx; }
    function getY() { return cy; }
    function getCurrentWord() { return challengeWord; }
    function resolve() { resolved = true; }
    function isResolved() { return resolved; }
    function getEmote() { return EMOTE.SOULA_COLA; }

    self = {
        update,
        render,
        inRegion,
        isTooCloseToGate,
        refreshActive,
        getX,
        getY,
        resolve,
        isResolved,
        getEmote,
        getCurrentWord,
        tags: ['gateway', 'soda'],
        order: -200,
    };

    return self;
}

export default Soda;