import { retainTransform } from "./canvas";
import { TEAL, WHITE } from "./color";

function PoofParticle(cx, cy, ang) {
    let anim = 0;
    let r1 = Math.random() * 0.6 + 0.9;
    if (!ang) {
        ang = Math.random() * 3 - 1.5;
    }

    function render(ctx) {
        retainTransform(() => {
            const LW = Math.exp(-anim * 5) * 20 * Math.max(1 - anim / 2.0, 0);
            ctx.lineWidth = LW;
            let R1 = 60 * r1 * (1 - Math.exp(-anim * 5)) + anim * 10;
            
            ctx.strokeStyle = TEAL;
            ctx.beginPath();
            ctx.ellipse(cx, cy+LW*0.5, R1, R1/2.0, ang*0.8, 0, 6.28);
            ctx.stroke();

            ctx.strokeStyle = WHITE;
            ctx.beginPath();
            ctx.ellipse(cx, cy, R1, R1/2.0, ang, 0, 6.28);
            ctx.stroke();
        });
    }

    function update(dT) {
        anim += dT;
        if (anim > 2) {
            return true;
        }
    }

    return {
        update,
        render,
        order: 100,
    };
}

export default PoofParticle;