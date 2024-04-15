import * as bus from './bus';
import { add, clear } from './engine';
import Arena from './arena';
import Grim from './grim';
import Soul from './soul';
import SoulManager from './soul-manager';
import Gateway from './gateway';
import { EMOTE } from './emote-enum';
import Interaction from './interaction';
import HUD from './hud';
import Soda from './soda';
import Camera from './camera';
import AudioEngine from './audio';

function newGame() {
    clear();
    bus.clear();

    add(new Camera());
    add(new HUD());
    add(new Arena());
    add(new SoulManager());
    add(new Interaction());
    add(new Grim(-150, 0));
    add(new Gateway(0, 0, EMOTE.SOULA_COLA, 'SOLUKI'));
    add(new Soda(0, 0));
    // for (let i = 0; i < 5; i++) {
    //     add(new Soul(-50 - 15 * i, Math.cos(i * 2) * 20));
    // }

    AudioEngine.init();
}

export { newGame };