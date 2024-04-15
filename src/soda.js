import * as bus from './bus';
import { retainTransform } from "./canvas";
import { BLACK, BLUE, DARK_BLUE, GRAY, GREEN, LIGHT_GRAY, ORANGE, PURPLE, RED, TAN, TEAL, WHITE, YELLOW } from "./color";

function Soda(cx, cy) {
    let self;
    let anim = 0;
    let joltTime = 10;
    let joltHeight = 0;
    let joltAngle = 0;
    const joltTiming = [0.1, 0.73, 1.15, 1.53, 1.9, 2.1, 2.3, 2.45, 2.55, 2.7, 2.8, 2.9, 3.0, 3.1, 1000];
    const joltRate =   [8,   8,    8,    8,    10,  12,  14,  16,   16,   16,  16,  16,  16,  16,  17];
    let joltIndex = 0;

    function render(ctx) {
        retainTransform(() => {
            ctx.translate(cx, cy);

            const W = 6;
            const H = 10;
            const pivotAngle = joltAngle * Math.sin(joltTime * 20) * Math.exp(-joltTime * joltRate[joltIndex]);
            const q = joltTime * joltRate[joltIndex] / 6.0;
            const jump = Math.max(joltHeight * (q * 4 - q * q * 14) / 4.0, 0) / (0.2 + joltRate[joltIndex]/20.0);

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.beginPath();
            ctx.ellipse(0, 0, W * 0.7 * (1.0 - 5 * jump), W * 0.3 * (1 - 4 * jump), 0, 0, 6.28);
            ctx.fill();

            // Rotation
            ctx.translate(0, -3);
            ctx.rotate(pivotAngle);
            ctx.translate(0, 3 - jump * 110);
            const panim = anim - 3.0;

            // Zaps

            // Bubbles

            // Fumes
            if (panim >= 0) {
                for (let i = 0; i < 3; i++) {
                    retainTransform(() => {
                        const dh = -panim * 15 + i * 2+1;
                        const dx = Math.sin(i * 2) * panim * 1.5+0.5;
                        ctx.lineWidth = 0.4;
                        ctx.strokeStyle = WHITE;
                        ctx.beginPath();
                        ctx.moveTo(-W*0.4+Math.cos(panim*16+i) * 0.2+dx, -H*0.8+dh);
                        ctx.bezierCurveTo(-W*0.4+Math.cos(panim*16+1.5+i)*0.3+dx, -H*0.9+dh, -W*0.4+Math.cos(panim*16+3+i)*0.4+dx, -H*1.0+dh, -W*0.4+Math.cos(panim*16+4.5+i) * 0.5+dx, -H*1.1+dh);
                        ctx.stroke();
                    });
                }
            }

            // Can Tab
            ctx.lineWidth = 1;
            ctx.strokeStyle = LIGHT_GRAY;
            ctx.beginPath();
            if (anim > 3.05) {
                ctx.moveTo(-W*0.3, -H-0.3);
                ctx.lineTo(-W*0.06, -H-1.2);
            } else {
                ctx.moveTo(-W*0.3, -H-0.4);
                ctx.lineTo(0, -H-0.4);
            }
            ctx.closePath();
            ctx.stroke();

            // Core Can
            ctx.lineWidth = 1;
            ctx.strokeStyle = DARK_BLUE; // TBD: Color by word
            ctx.fillStyle = DARK_BLUE;
            ctx.beginPath();
            ctx.moveTo(-W/2, 0);
            ctx.lineTo(-W/2, -H);
            ctx.lineTo(W/2, -H);
            ctx.lineTo(W/2, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            // Banner
            ctx.lineWidth = 0.2;
            ctx.strokeStyle = TEAL; // TBD: Color by word
            ctx.fillStyle = TEAL;
            ctx.beginPath();
            ctx.moveTo(-W/2-0.4, -H*0.2);
            ctx.lineTo(-W/2-0.4, -H*0.7);
            ctx.lineTo(W/2+0.4, -H*0.7);
            ctx.lineTo(W/2+0.4, -H*0.2);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            // Soula Cola
            ctx.font = "0.8px monospace";
            ctx.fillStyle = WHITE;
            const textWidth = ctx.measureText('SOULA COLA').width;
            const xOffset = -textWidth / 2;
            ctx.fillText('SOULA COLA', xOffset, -H * 0.85);

            // Icon (TBD: icon by word)
            ctx.lineWidth = 0.2;
            ctx.strokeStyle = BLUE;
            ctx.fillStyle = BLUE;
            ctx.beginPath();
            ctx.moveTo(0, -H*0.6);
            ctx.lineTo(-H*0.1, -H*0.5);
            ctx.lineTo(0, -H*0.4);
            ctx.lineTo(H*0.1, -H*0.5);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            // Label
            ctx.font = "0.5px monospace";
            ctx.fillStyle = BLACK;
            const label = "Sour Coffee Bile";
            const textWidth2 = ctx.measureText(label).width;
            const xOffset2 = -textWidth2 / 2;
            ctx.fillText(label, xOffset2, -H * 0.27);

            
        });
    }

    function update(dT) {
        anim = window.sodaAudio.currentTime;
        joltTime += dT;

        if (joltIndex == joltTiming.length - 1 && anim < 0.5) {
            joltIndex = 0;
        } 
        const targetAnimTime = joltTiming[joltIndex];
        if (anim >= targetAnimTime) {
            joltHeight = Math.random() * 0.1 + 0.1;
            joltAngle = 0.25;
            if (joltIndex % 2 == 0) {
                joltAngle *= -1;
            }
            joltTime = 0;
            joltIndex += 1;
        }

        self.order = 50 + cy / 100;
    }

    function getX() { return cx; }
    function getY() { return cy; }

    self = {
        update,
        render,
        getX,
        getY,
        tags: ['soda'],
        order: -199,
    };

    return self;
}

export default Soda;