import * as bus from './bus'
import sodaData from "../audio/soda.wav";
import lightTapData from "../audio/light-tap.wav";
import badTapData from "../audio/bad-tap.wav";
import skylightData from "../audio/skylight.wav";
import transcendData from "../audio/transcend.wav";
import walkingData from "../audio/walking.wav";

function clamp(v, a, b) {
    return Math.min(Math.max(v, a), b);
}

function AudioEngine() {   
    const sodaAudio = new Audio(sodaData);
    const lightTapAudio = new Audio(lightTapData);
    const badTapAudio = new Audio(badTapData);
    const skylightAudio = new Audio(skylightData);
    const transcendAudio = new Audio(transcendData);
    const walkingAudio = new Audio(walkingData);

    // Audio balance
    sodaAudio.volume = 0.8;
    lightTapAudio.volume = 0.3;
    badTapAudio.volume = 0.4;
    skylightAudio.volume = 0.1;
    transcendAudio.volume = 0.1;
    walkingAudio.volume = 1.0;

    walkingAudio.loop = true;

    function init() {
        bus.on('soda-pop', () => { sodaAudio.currentTime = 0; sodaAudio.play(); });
        bus.on('interact-fill', () => { lightTapAudio.currentTime = 0; lightTapAudio.play(); });
        bus.on('interact-error', () => { badTapAudio.currentTime = 0; badTapAudio.play(); });
        bus.on('consume', () => { transcendAudio.currentTime = 0; transcendAudio.play(); });
        bus.on('level-clear', () => { transcendAudio.currentTime = 0; transcendAudio.play(); });
        bus.on('spawn-gateway', () => { skylightAudio.currentTime = 0; skylightAudio.play(); });
        bus.on('player-moving', () => { walkingAudio.play(); });
        bus.on('player-stopped', () => { walkingAudio.pause(); });
    }

    return {
        init,
    }
}

export default AudioEngine;