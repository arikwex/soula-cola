import { retainTransform } from "./canvas";
import { GRAY, LIGHT_GRAY, TAN, WHITE } from "./color";

function Grim() {
    let x = 0;
    let y = 0;
    let angle = 0;
    let anim = 0;

    function renderHead(ctx, C, S) {
        ctx.fillStyle = WHITE;
        ctx.strokeStyle = WHITE;
        S -= 0.2;
        if (S < 0) {
            const wd = Math.max(Math.min(-20 * S, 14), 0.0);
            const s = (14 - wd) * 0.5;
            ctx.lineWidth = wd;
            ctx.beginPath();
            ctx.moveTo(C * (8 + s), -26 - s * 0.7);
            ctx.lineTo(C * (8 + s), -22 + s * 0.7);
            ctx.stroke();
        }
    }

    function renderCloak(ctx, C) {
        // Torso
        ctx.fillStyle = GRAY;
        ctx.strokeStyle = GRAY;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-7, 0);
        ctx.lineTo(-2, -24);
        ctx.lineTo(2, -24);
        ctx.lineTo(7, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Hood
        ctx.beginPath();
        ctx.lineTo(-11 * C, -16);
        ctx.bezierCurveTo(-11 * C, -32, -10 * C, -36, 7 * C, -34);
        ctx.lineTo(7 * C, -17);
        ctx.lineTo(0, -22);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.moveTo(C * 5, -27);
        ctx.lineTo(C * 5, -22);
        ctx.stroke();
    }

    function render(ctx) {
        retainTransform(() => {
            ctx.translate(x, y);
            
            const C = Math.cos(angle);
            const S = Math.sin(angle);

            // if (S > 0) {
            //     renderHead(ctx, C, S);
            //     renderCloak(ctx, C);
            // } else {
            renderCloak(ctx, C);
            renderHead(ctx, C, S);
            // }
        });
    }

    function update(dT) {
        // angle = Math.cos(Date.now()*0.01) * 0.1; //dT * 2;
        angle += dT * 3;
        x += Math.cos(angle) * 13 * dT;
        y -= Math.sin(angle) * 13 * dT;
    }

    return {
        update,
        render,
        order: 50,
    };
}

export default Grim;