import * as bus from './bus';
import { EMOTE } from './emote-enum';
import { getObjectsByTag } from "./engine";

function Camera() {
    let self;
    let tweenTime;

    function render(ctx) {
        // MODIFIES CAMERA CONTEXT FOR ALL!
        let tweenP = 1 - tweenTime;
        let tweenQ = tweenTime;

        const grim = getObjectsByTag('grim')[0];
        if (grim) {
            ctx.translate(-grim.getX() * 0.4 * tweenP, -grim.getY() * 0.4 * tweenP);
            ctx.scale(1 + 0.3 * tweenP, 1 + 0.3 * tweenP);
        }

        const soda = getObjectsByTag('soda')[0];
        if (soda) {
            ctx.translate(-soda.getX() * tweenQ, -soda.getY() * tweenQ);
            let s = 0;
            let t = window.sodaAudio.currentTime;
            if (t < 3.0) {
                s = t * 4;
            } else {
                s = 3.0*4 - (1.0 - Math.exp(-(t-3.0) * 4)) * 25;
            }
            ctx.scale(1 + (44 + s) * tweenQ, 1 + (44 + s) * tweenQ);
            ctx.translate(0, 5 * tweenQ);
        }
    }

    function update(dT) {
        if (tweenTime < 1.0) {
            tweenTime += dT;
        }
    }

    function onConsume({ emote }) {
        if (emote == EMOTE.SOULA_COLA) {
            tweenTime = 0;
            bus.emit('soda-pop');
        }
    }

    bus.on('consume', onConsume);
    function onRemove() {
        bus.off('consume', onConsume);
    }

    self = {
        update,
        render,
        onRemove,
        tags: ['camera'],
        order: -9999,
    };

    return self;
}

export default Camera;