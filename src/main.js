import * as bus from './bus';
import { add } from './engine';
import Audio from './audio';
import Arena from './arena';
import Grim from './grim';
import Soul from './soul';
import SoulManager from './soul-manager';

function initialize() {
    add(new Arena());
    add(new SoulManager());
    add(new Grim(0, 0));
    for (let i = 0; i < 6; i++) {
        add(new Soul(-50 - 15 * i, Math.cos(i * 2) * 20));
    }

    Audio().init();
}
initialize();
