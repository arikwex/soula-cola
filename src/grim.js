import { retainTransform } from "./canvas";
import { GRAY, LIGHT_GRAY, TAN, WHITE } from "./color";

function Grim() {
    let x = 0;
    let y = 0;
    let anim = 0;

    function render(ctx) {
        retainTransform(() => {
            ctx.translate(x, y);
            
            // Head
            ctx.fillStyle = WHITE;
            ctx.strokeStyle = WHITE;
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(8, -26);
            ctx.lineTo(8, -22);
            ctx.stroke();
            
            // Cloak
            ctx.fillStyle = GRAY;
            ctx.strokeStyle = GRAY;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-7, 0);
            ctx.lineTo(-2, -24);
            ctx.lineTo(-11, -16);
            ctx.bezierCurveTo(-11, -32, -10, -36, 7, -34);
            ctx.lineTo(7, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
    }

    function update(dT) {
        anim += dT * 2;
    }

    return {
        update,
        render,
        order: 50,
    };
}

export default Grim;