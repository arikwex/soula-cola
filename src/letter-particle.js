import { retainTransform } from "./canvas";
import { TEAL, WHITE } from "./color";

function LetterParticle(cx, cy, text) {
    let anim = 0;

    function render(ctx) {
        retainTransform(() => {
            const s = 1.0 + anim * 1.0;
            ctx.translate(cx, cy);
            ctx.scale(s,s);
            ctx.translate(0, -100);
            
            ctx.font = "40px monospace";
            const textWidth = ctx.measureText(text).width;
            const xOffset = -textWidth / 2;
            ctx.fillStyle = `rgba(255,255,0,${Math.max(1 - anim * 2, 0)})`;
            ctx.fillText(text, xOffset, 0);
        });
    }

    function update(dT) {
        anim += dT * 2;
        if (anim > 0.5) {
            return true;
        }
    }

    return {
        update,
        render,
        order: 1005,
    };
}

export default LetterParticle;