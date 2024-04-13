import { retainTransform } from "./canvas";
import { TAN } from "./color";

function Arena(cx, cy, dmg, color) {
    let anim = 0;
    function render(ctx) {
        ctx.fillStyle = TAN;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.05) {
            const R = 490 * (1 + Math.cos(a * 5 + anim*0.3) * 0.03 + Math.cos(a * 9 - anim * 0.5) * 0.02 +  + Math.cos(a * 17 + anim * 0.9) * 0.01 + Math.cos(a * 4 + 3) * 0.02);
            if (a == 0) { ctx.moveTo(Math.cos(a) * R, Math.sin(a) * R * 0.6); }
            else { ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R * 0.6); }
        }
        ctx.fill();
    }

    function update(dT) {
        anim += dT * 2;
    }

    return {
        update,
        render,
        order: -1000,
    };
}

export default Arena;