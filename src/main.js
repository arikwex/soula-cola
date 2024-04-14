import * as bus from './bus';
import { add } from './engine';
import Audio from './audio';
import Arena from './arena';
import Grim from './grim';
import Soul from './soul';

function initialize() {
    add(new Arena());
    add(new Grim(0, 0));
    
    for (let i = 0; i < 6; i++) {
        add(new Soul(-50 - 35 * i, 0));
    }

    Audio().init();
}
initialize();
