import { retainTransform } from "./canvas";
import { BLUE, GRAY, GREEN, LIGHT_GRAY, ORANGE, PURPLE, RED, TAN, WHITE, YELLOW } from "./color";
import { EMOTE } from "./emote-enum";

function Gateway(cx, cy, emote, challengeWord) {
    let activeTimer = 0;
    let spawningAnim = 0;
    let resolved = false;
    let msg = null;
    try {
        msg = new SpeechSynthesisUtterance();
        msg.text = challengeWord.toUpperCase();
        msg.lang = 'ro';
        msg.pitch = 0.0;
    } catch {}

    function render(ctx) {
        retainTransform(() => {
            if (spawningAnim > 0.5) {
                // Gateway vis
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
            }

            // Spawning-in animation
            if (spawningAnim < 1.0) {
                const S = 1.1 - 1.1 * Math.exp(-spawningAnim * 4);
                const H = 1 * Math.exp(-spawningAnim * 5) + 0.02;
                const alpha = Math.min(spawningAnim * 2, 1) * Math.min(Math.max(5 - spawningAnim * 5, 0), 1);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    const dx = Math.cos(i/6*6.28) * 70 * S;
                    const dy = Math.sin(i/6*6.28) * 70/2 * S;
                    const dx2 = Math.cos((i+1)/6*6.28) * 70 * S;
                    const dy2 = Math.sin((i+1)/6*6.28) * 70/2 * S;
                    ctx.moveTo(cx+dx, cy+dy);
                    ctx.lineTo(cx+dx2, cy+dy2);
                    ctx.lineTo(cx+dx2, cy+dy2-400 * H);
                    ctx.lineTo(cx+dx, cy+dy-400 * H);
                    ctx.fill();
                }
            }
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
        spawningAnim += dT;
    }

    function inRegion(tx, ty) {
        const dx = tx - cx;
        const dy = ty - cy;
        return (spawningAnim > 1.0) && (dx * dx + (dy * dy) * 2 < 65 * 65);
    }

    function isTooCloseToGate(tx, ty) {
        const dx = tx - cx;
        const dy = ty - cy;
        return dx * dx + (dy * dy) * 2 < 130 * 130;
    }

    function refreshActive() {
        activeTimer = 0.2;
    }

    function getX() { return cx; }
    function getY() { return cy; }
    function getEmote() { return emote; }
    function getCurrentWord() { return challengeWord; }
    function resolve() { 
        resolved = true; 
        try { 
            msg.lang = 'ro';
            window.speechSynthesis.speak(msg);
        } catch{}
    }
    function isResolved() { return resolved; }

    return {
        update,
        render,
        inRegion,
        isTooCloseToGate,
        refreshActive,
        resolve,
        isResolved,
        getX,
        getY,
        getEmote,
        getCurrentWord,
        tags: ['gateway'],
        order: -200,
    };
}

export default Gateway;