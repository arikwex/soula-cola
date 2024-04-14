import { retainTransform } from "./canvas";
import { BLACK, BLUE, BROWN, DARK_BLUE, DARK_ORANGE, DARK_RED, GRAY, LIGHT_GRAY, LIGHT_PURPLE, ORANGE, TAN, TEAL, WHITE } from "./color";
import { getObjectsByTag } from "./engine";

function Soul(x, y) {
    let self = null;
    let vx = 0;
    let vy = 0;
    let actualMotion = 0;
    let SPEED = 70 + Math.random() * 30;
    
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
            // Face
            ctx.lineWidth = wd * WIDTH;
            ctx.beginPath();
            ctx.moveTo(C * (5 + s) * WIDTH, (-20 + H) * HEIGHT - s * 0.7 - 6);
            ctx.lineTo(C * (5 + s) * WIDTH, (-20 + H) * HEIGHT + s * 0.7 - 2 + FACE_HEIGHT);
            ctx.stroke();

            // Eyes
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
        // anim += dT * 0.3;
        // angle += dT * 2.0;
        
        let tx = 0;
        let ty = 0;
        
        // Grim tracking
        const grim = getObjectsByTag('grim')[0];
        if (grim) {
            tx = grim.getX() - x;
            ty = grim.getY() - y;
        }

        // Motion
        const M = Math.sqrt(tx*tx + ty*ty);
        if (M > 55) {
            tx *= SPEED / M;
            ty *= SPEED / M;
            vx += (tx - vx) * 3.0 * dT;
            vy += (ty - vy) * 3.0 * dT;
        } else {
            vx += -vx * 5.0 * dT;
            vy += -vy * 5.0 * dT;
        }
        
        // Physics
        let bx = x;
        let by = y;
        x += vx * dT;
        y += vy * dT;
        
        // Collision
        handleCollision();

        let isMoving = false;
        let bx2 = (bx - x);
        let by2 = (by - y);
        if (bx2 * bx2 + by2 * by2 < 10 * dT) {
            anim += dT * (0.3 + WIDTH * 0.05);
        } else {
            anim += dT * (1.0 - HEIGHT * 0.07);
            isMoving = true;
        }

        if (isMoving) {
            angle = -Math.atan2(vy, vx);
        } else {
            angle += Math.cos(anim * 5) * 1.0 * dT;
        }

        self.order = 50 + y / 100;
    }

    function handleCollision() {
        const souls = getObjectsByTag('soul');
        const grim = getObjectsByTag('grim')[0];
        souls.push(grim);
        const R = 14;
        for (let i = 0; i < souls.length; i++) {
            if (souls[i] == self) {
                continue;
            }
            const dx = souls[i].getX() - x;
            const dy = souls[i].getY() - y;
            const M = Math.sqrt(dx * dx + dy * dy);
            if (M < R + R) {
                x = souls[i].getX() - dx / M * R * 2 + Math.random() - 0.5;
                y = souls[i].getY() - dy / M * R * 2 + Math.random() - 0.5;
            }
        }
    }

    function getX() { return x; }
    function getY() { return y; }

    self = {
        update,
        render,
        getX,
        getY,
        tags: ['soul'],
        order: 40,
    };

    return self;
}

export default Soul;