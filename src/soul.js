import * as bus from './bus';
import { retainTransform } from "./canvas";
import { WHITE } from "./color";
import { EMOTE } from "./emote-enum";
import { add, getObjectsByTag } from "./engine";
import PoofParticle from './poof-particle';

function Soul(x, y) {
    let self = null;
    let vx = 0;
    let vy = 0;
    let SPEED = 50 + Math.random() * 60;
    
    let HEIGHT = 0.9 + Math.random() * 1.0; // 0.9 - 1.9
    let WIDTH = 0.9 + Math.random() * 0.4; // 0.9 - 1.3
    let FACE_HEIGHT = Math.random() * 8.0; // 0 - 8
    let FACE_WIDTH = Math.random() * 2.3 + 1.7; // 1.7 - 4
    let FACE_PLACE = -1 + Math.random() * 8; // -1 - 7

    let angle = Math.random() * 7;
    let anim = Math.random() * 100;

    let desiredEmote = null;
    let hunger = 0;
    let hungerAnim = Math.random() * 100;

    function getFadeFactor() {
        return (1-Math.max(hunger - 1, 0));
    }

    function getFaceColor() {
        // 00A2E8
        let q = getFadeFactor();
        let R = 0;
        let G = 162;
        let B = 232;
        let A = 1;
        R = R * q + 200 * (1-q);
        G = G * q + 200 * (1-q);
        B = B * q + 200 * (1-q);
        A = A * q + 0.2 * (1-q);
        return `rgba(${R},${G},${B},${A})`;
    }

    function getTorsoColor() {
        // 3F48CC
        let q = getFadeFactor();
        let R = 63;
        let G = 72;
        let B = 204;
        let A = 1;
        R = R * q + 200 * (1-q);
        G = G * q + 200 * (1-q);
        B = B * q + 200 * (1-q);
        A = A * q + 0.2 * (1-q);
        return `rgba(${R},${G},${B},${A})`;
    }

    function renderFace(ctx, C, S, H) {
        ctx.strokeStyle = getFaceColor();
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

    function renderBody(ctx, C, S, H) {
        // Torso
        const col = getTorsoColor();
        ctx.fillStyle = col;
        ctx.strokeStyle = col;
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

        // Horns
        ctx.strokeStyle = col;
        ctx.lineWidth = 5 * WIDTH;
        ctx.beginPath();
        ctx.moveTo(S * 6, (-20 + H) * HEIGHT - 11);
        ctx.lineTo(S * 7, (-20 + H) * HEIGHT - 16);
        ctx.moveTo(-S * 6, (-20 + H) * HEIGHT - 11);
        ctx.lineTo(-S * 7, (-20 + H) * HEIGHT - 16);
        ctx.stroke();
    }

    function renderEmote(ctx) {
        // Emote
        if (desiredEmote != null) {
            if (desiredEmote == EMOTE.TRIANGLE) { renderTriangleEmote(ctx, 0); }
            else if (desiredEmote == EMOTE.YOTA) { renderYotaEmote(ctx, 0); }
            else if (desiredEmote == EMOTE.CIRCLE) { renderCircleEmote(ctx, 0); }
            else if (desiredEmote == EMOTE.WAVE) { renderWaveEmote(ctx, 0); }
        }
    }

    function renderTriangleEmote(ctx, dy) {
        ctx.strokeStyle = `rgba(255,192,14,${Math.cos(hungerAnim) * 0.5 + 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -20 * HEIGHT - 34 + dy);
        ctx.lineTo(7, -20 * HEIGHT - 24 + dy);
        ctx.lineTo(-7, -20 * HEIGHT - 24 + dy);
        ctx.closePath();
        ctx.stroke();
    }

    function renderYotaEmote(ctx, dy) {
        ctx.strokeStyle = `rgba(34,200,15,${Math.cos(hungerAnim) * 0.5 + 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -20 * HEIGHT - 24);
        ctx.lineTo(0, -20 * HEIGHT - 28);
        ctx.moveTo(-5, -20 * HEIGHT - 34);
        ctx.bezierCurveTo(-5, -20 * HEIGHT - 28, 5, -20 * HEIGHT - 28, 5, -20 * HEIGHT - 34);
        ctx.stroke();
    }

    function renderCircleEmote(ctx, dy) {
        ctx.strokeStyle = `rgba(237,28,38,${Math.cos(hungerAnim) * 0.5 + 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, -20 * HEIGHT - 29 + dy, 6.5, -Math.PI / 2, 1.5 * Math.PI);
        ctx.lineTo(0, -20 * HEIGHT - 24 + dy);
        ctx.stroke();
    }

    function renderWaveEmote(ctx, dy) {
        // ctx.strokeStyle = TEAL; // 99D9EA
        ctx.strokeStyle = `rgba(163,217,234,${Math.cos(hungerAnim) * 0.5 + 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-7, -20 * HEIGHT - 29-3+dy);
        ctx.bezierCurveTo(-4, -20 * HEIGHT - 37-3+dy, 4, -20 * HEIGHT - 21-3+dy, 7, -20 * HEIGHT - 29-3+dy);
        ctx.moveTo(-7, -20 * HEIGHT - 29+3+dy);
        ctx.bezierCurveTo(-4, -20 * HEIGHT - 37+3+dy, 4, -20 * HEIGHT - 21+3+dy, 7, -20 * HEIGHT - 29+3+dy);
        ctx.stroke();
    }

    function render(ctx) {
        retainTransform(() => {
            ctx.translate(x, y);
            
            const C = Math.cos(angle);
            const S = Math.sin(angle);
            const H = Math.abs(Math.cos(anim * 12)) * 2;

            renderBody(ctx, C, S, H);
            renderFace(ctx, C, S, H);
            renderEmote(ctx);
        });
    }

    function update(dT) {
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

        // Emote and hunger
        if (desiredEmote !== null) {
            hungerAnim += dT * hunger * 10;
            hunger += dT * 0.05;
            if (hunger > 2) {
                add(new PoofParticle(x, y-20*HEIGHT/2));
                setTimeout(() => {add(new PoofParticle(x, y-20*HEIGHT/2));}, Math.random() * 100 + 50);
                return true;
            }
        }

        self.order = 50 + y / 100;
    }

    function handleCollision() {
        const hitboxes = getObjectsByTag('hitbox');
        const R = 14;
        for (let i = 0; i < hitboxes.length; i++) {
            if (hitboxes[i] == self) {
                continue;
            }
            const dx = hitboxes[i].getX() - x;
            const dy = hitboxes[i].getY() - y;
            const M = Math.sqrt(dx * dx + dy * dy);
            if (M < R + R) {
                x = hitboxes[i].getX() - dx / M * R * 2 + Math.random() - 0.5;
                y = hitboxes[i].getY() - dy / M * R * 2 + Math.random() - 0.5;
            }
        }
    }

    function getX() { return x; }
    function getY() { return y; }

    function onAssignEmote({ soul, emote }) {
        if (self !== soul) {
            return;
        }
        desiredEmote = emote;
    }

    bus.on('assign-emote', onAssignEmote);
    function onRemove() {
        bus.off('assign-emote', onAssignEmote);
    }

    self = {
        update,
        render,
        getX,
        getY,
        onRemove,
        tags: ['soul', 'hitbox'],
        order: 40,
    };

    return self;
}

export default Soul;