import { retainTransform } from "./canvas";
import { TEAL, WHITE } from "./color";
import { EMOTE } from "./emote-enum";

function HexParticle(cx, cy, emote) {
    let anim = 0;
    let R = 255;
    let G = 255;
    let B = 255;
    if (emote == EMOTE.TRIANGLE) { R = 255; G = 192; B = 14; }
    if (emote == EMOTE.YOTA) { R = 24; G = 200; B = 15; }
    if (emote == EMOTE.CIRCLE) { R = 237; G = 28; B = 38; }
    if (emote == EMOTE.WAVE) { R = 163; G = 73; B = 164; }

    function render(ctx) {
        retainTransform(() => {
            const S = 1.0 + (1.0 - Math.exp(-anim * 2));
            const H = 1;
            const alpha = Math.max(1 - anim, 0);
            ctx.fillStyle = `rgba(${R},${G},${B},${alpha})`;
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
        });
    }

    function update(dT) {
        anim += dT * 2;
        if (anim > 1) {
            return true;
        }
    }

    return {
        update,
        render,
        order: 900,
    };
}

export default HexParticle;