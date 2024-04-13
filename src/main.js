import * as bus from './bus';
import { add } from './engine';
import Audio from './audio';
import Arena from './arena';
import Grim from './grim';

function initialize() {
    add(new Arena());
    add(new Grim());

    Audio().init();
}
initialize();
