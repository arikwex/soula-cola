import * as bus from './bus';
import { EMOTE } from './emote-enum';
import { add, getObjectsByTag, remove } from "./engine";
import HexParticle from './hex-particle';
import Soul from './soul';

const MODE = {
    GRIM: 0,
    SODA: 1,
}

function Camera() {
    let self;
    let tweenTime = 0;
    let modeTime = 0;
    let mode = MODE.GRIM;

    function render(ctx) {
        // MODIFIES CAMERA CONTEXT FOR ALL!
        let tweenP = Math.min(Math.max(1 - tweenTime, 0), 1);
        let tweenQ = Math.min(Math.max(tweenTime, 0), 1);

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
            ctx.scale(1 + (40 + s) * tweenQ, 1 + (40 + s) * tweenQ);
            ctx.translate(0, 5 * tweenQ);
        }
    }

    function update(dT) {
        if (mode == MODE.SODA) {
            modeTime += dT;
            if (tweenTime < 1.0) {
                tweenTime += dT * 0.4;
            }
            const grim = getObjectsByTag('grim')[0];
            if (grim) {
                if (grim.getX() < 0) {
                    grim.setTargetPose(-42, 0, 1);
                } else {
                    grim.setTargetPose(42, 0, -1);
                }
            }
            if (modeTime > 7) {
                mode = MODE.GRIM;
                tweenTime = 1;
                setTimeout(() => {
                    endSodaAnimation();
                }, 3000);
            }
        }
        if (mode == MODE.GRIM) {
            modeTime += dT;
            if (tweenTime > 0.0) {
                tweenTime -= dT * 0.4;
            }
        }
    }

    function endSodaAnimation() {
        add(new HexParticle(0, 0, -1));
        bus.emit('spawn-souls');
        remove(getObjectsByTag('soda'));
    }

    function onConsume({ emote }) {
        if (emote == EMOTE.SOULA_COLA) {
            tweenTime = 0;
            modeTime = 0;
            setTimeout(() => {
                mode = MODE.SODA;
            }, 500);
            setTimeout(() => {
                bus.emit('soda-pop');
            }, 1500);
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