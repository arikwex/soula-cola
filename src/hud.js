import * as bus from './bus';
import { retainTransform } from "./canvas";
import { BLUE, DARK_BLUE, RED, TEAL, WHITE } from "./color";
import { EMOTE } from "./emote-enum";

function HUD(cx, cy, emote) {
    let freed = 0;
    let allowance = 5;

    function render(ctx) {
        retainTransform(() => {
            // Freed soul counter
            ctx.setTransform(1, 0, 0, 1, 50, 70);
            renderSoul(ctx);
            ctx.font = "32px monospace";
            ctx.fillStyle = WHITE;
            ctx.fillText(`${freed}`, 23, -13);

            // Lost soul counter
            ctx.setTransform(1, 0, 0, 1, 50, 110);
            renderAllowance(ctx);
            ctx.font = "32px monospace";
            ctx.fillStyle = WHITE;
            ctx.fillText(`${allowance}`, 23, 3);
        });
    }

    function renderAllowance(ctx) {
        ctx.strokeStyle = RED;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(-6, -6);
        ctx.lineTo(6, 6);
        ctx.moveTo(-6, 6);
        ctx.lineTo(6, -6);
        ctx.closePath();
        ctx.stroke();
    }

    function renderSoul(ctx) {
        // Torso
        ctx.fillStyle = DARK_BLUE;
        ctx.strokeStyle = DARK_BLUE;
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // // Hood-face/lining
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.moveTo(0, -20 - 7);
        ctx.lineTo(0, -20 - 2);
        ctx.stroke();

        // Horns
        ctx.strokeStyle = DARK_BLUE;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(6, -20 - 11);
        ctx.lineTo(7, -20 - 16);
        ctx.moveTo(-6, -20 - 11);
        ctx.lineTo(-7, -20 - 16);
        ctx.stroke();

        // Face
        ctx.strokeStyle = BLUE;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(0, -20 - 6);
        ctx.lineTo(0, -20 - 2);
        ctx.stroke();

        // Eyes
        ctx.strokeStyle = WHITE;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-3, -20 - 5);
        ctx.lineTo(-3, -20 - 5);
        ctx.moveTo(3, -20 - 5);
        ctx.lineTo(3, -20 - 5);
        ctx.stroke();
    }

    function update(dT) {
    }

    function onConsumeSuccess() {
        freed += 1;
    }

    function onExploded() {
        allowance = Math.max(allowance - 1, 0);
    }

    bus.on('consume-success', onConsumeSuccess);
    bus.on('exploded', onExploded);
    function onRemove() {
        bus.off('consume-success', onConsumeSuccess);
        bus.off('exploded', onExploded);
    }

    return {
        update,
        render,
        onRemove,
        order: 99999,
    };
}

export default HUD;