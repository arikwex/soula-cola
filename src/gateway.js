import { retainTransform } from "./canvas";
import { BLUE, GRAY, GREEN, LIGHT_GRAY, ORANGE, PURPLE, TAN, WHITE, YELLOW } from "./color";
import { EMOTE } from "./emote-enum";

function Gateway(cx, cy, emote) {
    let activeTimer = 0;

    function render(ctx) {
        retainTransform(() => {
            ctx.lineWidth = 5;
            
            if (emote == EMOTE.TRIANGLE) renderTriangleEmote(ctx);
            if (emote == EMOTE.YOTA) renderYotaEmote(ctx);
            if (emote == EMOTE.CIRCLE) renderCircleEmote(ctx);
            if (emote == EMOTE.WAVE) renderWaveEmote(ctx);

            if (activeTimer > 0) {
                if (emote == EMOTE.TRIANGLE) ctx.strokeStyle = ORANGE;
                if (emote == EMOTE.YOTA) ctx.strokeStyle = GREEN;
                if (emote == EMOTE.CIRCLE) ctx.strokeStyle = RED;
                if (emote == EMOTE.WAVE) ctx.strokeStyle = PURPLE;
            } else {
                ctx.strokeStyle = LIGHT_GRAY;
            }
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const dx = Math.cos(i/6*6.28) * 70;
                const dy = Math.sin(i/6*6.28) * 70/2;
                if (i == 0) ctx.moveTo(cx+dx, cy+dy);
                else ctx.lineTo(cx+dx, cy+dy);
            }
            ctx.closePath();
            ctx.moveTo(cx+55, cy);
            ctx.ellipse(cx, cy, 55, 55/2, 0, 0, 6.28);
            ctx.stroke();
        });
    }

    function renderTriangleEmote(ctx) {
        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx + 0, cy - 24);
        ctx.lineTo(cx + 44, cy + 12);
        ctx.lineTo(cx + -44, cy + 12);
        ctx.closePath();
        ctx.stroke();
    }

    function renderYotaEmote(ctx) {
        ctx.strokeStyle = GREEN;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx, cy + 23);
        ctx.lineTo(cx, cy + 5);
        ctx.moveTo(cx - 40, cy - 14);
        ctx.bezierCurveTo(cx - 30, cy + 8, cx + 30, cy + 8, cx + 40, cy - 14);
        ctx.stroke();
    }

    function renderCircleEmote(ctx) {
        ctx.strokeStyle = RED;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 33, 21, 0, 0, 2 * Math.PI);
        ctx.moveTo(cx, cy - 21);
        ctx.lineTo(cx, cy + 21);
        ctx.stroke();
    }

    function renderWaveEmote(ctx, dy) {
        ctx.strokeStyle = PURPLE;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx - 45, cy - 10);
        ctx.bezierCurveTo(cx - 15, cy - 30, cx + 15, cy + 10, cx + 45, cy - 10);
        ctx.moveTo(cx - 45, cy + 10);
        ctx.bezierCurveTo(cx - 15, cy - 10, cx + 15, cy + 30, cx + 45, cy + 10);
        ctx.stroke();
    }

    function update(dT) {
        activeTimer -= dT;
    }

    function inRegion(tx, ty) {
        const dx = tx - cx;
        const dy = ty - cy;
        return dx * dx + (dy * dy) * 2 < 65 * 65;
    }

    function refreshActive() {
        activeTimer = 0.2;
    }

    function getX() { return cx; }
    function getY() { return cy; }
    function getEmote() { return emote; }
    function getCurrentWord() { return "QWE"; }

    return {
        update,
        render,
        inRegion,
        refreshActive,
        getX,
        getY,
        getEmote,
        getCurrentWord,
        tags: ['gateway'],
        order: -200,
    };
}

export default Gateway;