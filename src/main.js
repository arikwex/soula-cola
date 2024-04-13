import * as bus from './bus';
import { add } from './engine';
import Audio from './audio';
import Arena from './arena';

function initialize() {
    add(new Arena());
     
    Audio().init();
}
initialize();
