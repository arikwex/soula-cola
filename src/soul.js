import { retainTransform } from "./canvas";
import { BLACK, BLUE, BROWN, DARK_BLUE, DARK_ORANGE, DARK_RED, GRAY, LIGHT_GRAY, LIGHT_PURPLE, ORANGE, TAN, TEAL, WHITE } from "./color";

function Soul(x, y) {
    let self = null;
    let vx = 0;
    let vy = 0;
    let SPEED = 90;
    
    let HEIGHT = 0.9 + Math.random() * 1.0; // 0.9 - 1.9
    let WIDTH = 0.9 + Math.random() * 0.4; // 0.9 - 1.3
    let FACE_HEIGHT = Math.random() * 8.0; // 0 - 8
    let FACE_WIDTH = Math.random() * 2.3 + 1.7; // 1.7 - 4
    let FACE_PLACE = -1 + Math.random() * 8; // -1 - 7

    let angle = Math.random() * 7;
    let anim = Math.random() * 100;

    function renderFace(ctx, C, S, H) {
        ctx.strokeStyle = BLUE;
        S -= 0.2;
        if (S < 0) {
            const wd = Math.max(Math.min(-16 * S, 14), 0.0);
            const s = (14 - wd) * 0.5;
            ctx.lineWidth = wd * WIDTH;
            ctx.beginPath();
            ctx.moveTo(C * (5 + s) * WIDTH, (-20 + H) * HEIGHT - s * 0.7 - 6);
            ctx.lineTo(C * (5 + s) * WIDTH, (-20 + H) * HEIGHT + s * 0.7 - 2 + FACE_HEIGHT);
            ctx.stroke();

            ctx.strokeStyle = WHITE;
            ctx.lineWidth = 3 * wd / 14.0;
            ctx.beginPath();
            ctx.moveTo(C * (7 + s) * WIDTH - FACE_WIDTH * S, (-20 + H) * HEIGHT - FACE_PLACE);
            ctx.lineTo(C * (7 + s) * WIDTH - FACE_WIDTH * S, (-20 + H) * HEIGHT - FACE_PLACE + 0.1);
            ctx.moveTo(C * (7 + s) * WIDTH + FACE_WIDTH * S, (-20 + H) * HEIGHT - FACE_PLACE);
            ctx.lineTo(C * (7 + s) * WIDTH + FACE_WIDTH * S, (-20 + H) * HEIGHT - FACE_PLACE + 0.1);
            ctx.stroke();
        }
    }

    function renderBody(ctx, C, H) {
        // Torso
        ctx.fillStyle = DARK_BLUE;
        ctx.strokeStyle = DARK_BLUE;
        const Q = H * 3.0;
        ctx.lineWidth = (16 * WIDTH + Q);
        ctx.beginPath();
        ctx.moveTo(0, -5 - Q * WIDTH * 0.5 - WIDTH * 2);
        ctx.lineTo(0, (-20 + H * 2) * HEIGHT);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Hood-face/lining
        ctx.lineWidth = 18 * WIDTH;
        ctx.beginPath();
        ctx.moveTo(C * 3, (-20 + H) * HEIGHT - 7);
        ctx.lineTo(C * 3, (-20 + H) * HEIGHT - 2 + FACE_HEIGHT);
        ctx.stroke();
    }

    function render(ctx) {
        retainTransform(() => {
            ctx.translate(x, y);
            
            const C = Math.cos(angle);
            const S = Math.sin(angle);
            const H = Math.abs(Math.cos(anim * 12)) * 2;

            renderBody(ctx, C, H);
            renderFace(ctx, C, S, H);
        });
    }

    function update(dT) {
        anim += dT * 0.3;
        angle += dT * 2.0;
        
        self.order = 50 + y / 100;
    }

    self = {
        update,
        render,
        order: 40,
    };

    return self;
}

export default Soul;