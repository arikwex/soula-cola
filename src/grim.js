import { retainTransform } from "./canvas";
import { BLACK, BROWN, DARK_ORANGE, DARK_RED, GRAY, LIGHT_GRAY, LIGHT_PURPLE, ORANGE, TAN, WHITE } from "./color";

function Grim(x, y) {
    let self = null;
    let vx = 0;
    let vy = 0;
    let SPEED = 90;
    let angle = 0;
    let anim = 0;
    let keys = {};

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
        ctx.moveTo(14 * S + 4.5 * C, -45 + H);
        ctx.lineTo(15 * S + 15 * C, -42 + H);
        ctx.lineTo(12 * S + 18 * C, -38 + H);
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
        ctx.moveTo(13 * S - 7 * C, 1.5 * C + H);
        ctx.lineTo(13 * S + 3 * C, -33 + H);
        ctx.lineTo(14 * S + 4 * C, -45 + H);
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
        ctx.moveTo(11 * S - 2 * C, -12 + H);
        ctx.lineTo(8 * S - 2 * C, -13 + H);
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
        let tx = 0;
        let ty = 0;
        if (keys['ArrowLeft']) { tx -= 1; }
        if (keys['ArrowRight']) { tx += 1; }
        if (keys['ArrowUp']) { ty -= 1; }
        if (keys['ArrowDown']) { ty += 1; }

        const M = Math.sqrt(tx*tx + ty*ty);
        if (M > 0.1) {
            tx *= SPEED / M;
            ty *= SPEED / M;
            vx += (tx - vx) * 10.0 * dT;
            vy += (ty - vy) * 10.0 * dT;
            anim += dT * 1.0;
        } else {
            vx += -vx * 5.0 * dT;
            vy += -vy * 5.0 * dT;
            anim += dT * 0.3;
        }
        
        x += vx * dT;
        y += vy * dT;
        angle = -Math.atan2(vy, vx);

        self.order = 50 + y / 100;
    }

    function onKeyDown(evt) {
        keys[evt.key] = true;
    }

    function onKeyUp(evt) {
        keys[evt.key] = false;
    }

    function onFocus(){
        keys = {};
    }

    window.addEventListener('focus', onFocus);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    function onRemove() {
        window.removeEventListener('focus', onFocus);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
    }

    function getX() { return x; }
    function getY() { return y; }

    self = {
        update,
        render,
        onRemove,
        getX,
        getY,
        tags: ['grim'],
        order: 50,
    };

    return self;
}

export default Grim;