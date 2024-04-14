import { retainTransform } from "./canvas";
import { BLACK, BROWN, DARK_ORANGE, DARK_RED, GRAY, LIGHT_GRAY, LIGHT_PURPLE, ORANGE, TAN, WHITE } from "./color";

function Grim() {
    let x = 0;
    let y = 0;
    let angle = 0;
    let anim = 0;

    function renderHead(ctx, C, S, H) {
        ctx.fillStyle = WHITE;
        ctx.strokeStyle = WHITE;
        S -= 0.2;
        if (S < 0) {
            const wd = Math.max(Math.min(-16 * S, 14), 0.0);
            const s = (14 - wd) * 0.5;
            ctx.lineWidth = wd;
            ctx.beginPath();
            ctx.moveTo(C * (8 + s), -26 - s * 0.7 + H);
            ctx.lineTo(C * (8 + s), -22 + s * 0.7 + H);
            ctx.stroke();
        }
    }

    function renderCloak(ctx, C, H) {
        // Torso
        ctx.fillStyle = BLACK;
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 4;
        ctx.beginPath();
        const Q = H * 0.5;
        ctx.moveTo(-7 - Q, 0);
        ctx.lineTo(-2 - Q, -24 + H);
        ctx.lineTo(2 + Q, -24 + H);
        ctx.lineTo(7 + Q, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Hood
        ctx.beginPath();
        ctx.lineTo(-11 * C, -16 + H);
        ctx.bezierCurveTo(-11 * C, -30 + H, -10 * C, -32 + H, 7 * C, -34 + H);
        ctx.lineTo(7 * C, -17 + H);
        ctx.lineTo(0, -22 + H / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Hood-face/lining
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.moveTo(C * 5, -27 + H);
        ctx.lineTo(C * 5, -22 + H);
        ctx.stroke();
    }

    function renderBlade(ctx, C, S, H) {
        ctx.fillStyle = LIGHT_GRAY;
        ctx.strokeStyle = LIGHT_GRAY;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(12 * S + 4.5 * C, -45 + H);
        ctx.lineTo(11 * S + 13 * C, -40 + H);
        ctx.lineTo(11 * S + 15 * C, -34 + H);
        ctx.stroke();
    }

    function renderScythe(ctx, C, S, H) {
        if (S > 0) {
            renderBlade(ctx, C, S, H);
        }
        if (C >= 0) {
            renderArm(ctx, C, S, H);
        }

        ctx.fillStyle = DARK_RED;
        ctx.strokeStyle = DARK_RED;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(11 * S - 7 * C, 1.5 * C + H);
        ctx.lineTo(11 * S + 3 * C, -33 + H);
        ctx.lineTo(12 * S + 4 * C, -45 + H);
        ctx.stroke();
        if (S <= 0) {
            renderBlade(ctx, C, S, H);
        }
        if (C < 0) {
            renderArm(ctx, C, S, H);
        }
    }

    function renderArm(ctx, C, S, H) {
        ctx.fillStyle = BLACK;
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(9 * S - 2 * C, -12 + H);
        ctx.lineTo(6 * S - 2 * C, -13 + H);
        ctx.stroke();
    }

    function render(ctx) {
        retainTransform(() => {
            ctx.translate(x, y);
            
            const C = Math.cos(angle);
            const S = Math.sin(angle);
            const H = Math.abs(Math.cos(anim * 12)) * 2;

            if (C < 0) {
                renderScythe(ctx, C, S, H);
            }
            renderCloak(ctx, C, H);
            renderHead(ctx, C, S, H);
            if (C >= 0) {
                renderScythe(ctx, C, S, H);
            }
        });
    }

    function update(dT) {
        anim += dT * 0.3;
        angle += dT * 2;
        // x += Math.cos(angle) * 43 * dT;
        // y -= Math.sin(angle) * 43 * dT;
    }

    return {
        update,
        render,
        order: 50,
    };
}

export default Grim;