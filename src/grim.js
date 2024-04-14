import { retainTransform } from "./canvas";
import { BLACK, BROWN, DARK_ORANGE, DARK_RED, GRAY, LIGHT_GRAY, LIGHT_PURPLE, ORANGE, TAN, WHITE } from "./color";

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
            const wd = Math.max(Math.min(-16 * S, 14), 0.0);
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
        ctx.fillStyle = BLACK;
        ctx.strokeStyle = BLACK;
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
        ctx.bezierCurveTo(-11 * C, -30, -10 * C, -32, 7 * C, -34);
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

    function renderBlade(ctx, C, S) {
        ctx.fillStyle = LIGHT_GRAY;
        ctx.strokeStyle = LIGHT_GRAY;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(12 * S + 4.5 * C, -45);
        ctx.lineTo(11 * S + 13 * C, -40);
        ctx.lineTo(11 * S + 15 * C, -34);
        ctx.stroke();
    }

    function renderScythe(ctx, C, S) {
        if (S > 0) {
            renderBlade(ctx, C, S);
        }
        ctx.fillStyle = DARK_RED;
        ctx.strokeStyle = DARK_RED;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(11 * S - 7 * C, 1.5 * C);
        ctx.lineTo(11 * S + 3 * C, -33);
        ctx.lineTo(12 * S + 4 * C, -45);
        ctx.stroke();
        if (S <= 0) {
            renderBlade(ctx, C, S);
        }

        // Arm holding scythe
        if (C < 0.85) {
            ctx.fillStyle = BLACK;
            ctx.strokeStyle = BLACK;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(9 * S - 2 * C, -11);
            ctx.lineTo(6 * S - 2 * C, -13);
            ctx.stroke();
        }
    }

    function render(ctx) {
        retainTransform(() => {
            ctx.translate(x, y);
            
            const C = Math.cos(angle);
            const S = Math.sin(angle);

            if (C < 0) {
                renderScythe(ctx, C, S);
            }
            renderCloak(ctx, C);
            renderHead(ctx, C, S);
            if (C >= 0) {
                renderScythe(ctx, C, S);
            }
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