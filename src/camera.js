import { getObjectsByTag } from "./engine";

function Camera() {
    let self;

    function render(ctx) {
        // MODIFIES CAMERA CONTEXT FOR ALL!
        // const grim = getObjectsByTag('grim')[0];
        // if (grim) {
        //     ctx.translate(-grim.getX() * 0.4, -grim.getY() * 0.4);
        //     ctx.scale(1.3, 1.3);
        // }

        const soda = getObjectsByTag('soda')[0];
        if (soda) {
            ctx.translate(-soda.getX(), -soda.getY());
            let s = 0;
            let t = window.sodaAudio.currentTime;
            if (t < 3.1) {
                s = t * 4;
            } else {
                s = 3.1*4 - (1.0 - Math.exp(-(t-3.1) * 4)) * 25;
            }
            ctx.scale(45 + s, 45 + s);
            ctx.translate(0, 5);
        }
    }

    function update(dT) {
    }

    self = {
        update,
        render,
        tags: ['camera'],
        order: -9999,
    };

    return self;
}

export default Camera;