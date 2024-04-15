import * as bus from './bus'
import sodaData from "../audio/soda.wav";
import lightTapData from "../audio/light-tap.wav";
import badTapData from "../audio/bad-tap.wav";
import skylightData from "../audio/skylight.wav";
import transcendData from "../audio/transcend.wav";
import walkingData from "../audio/walking.wav";
import meepData from "../audio/meep.wav";
import popData from "../audio/pop.wav";

function AudioEngine() {   
    const sodaAudio = new Audio(sodaData);
    const lightTapAudio = new Audio(lightTapData);
    const badTapAudio = new Audio(badTapData);
    const skylightAudio = new Audio(skylightData);
    const transcendAudio = new Audio(transcendData);
    const walkingAudio = new Audio(walkingData);
    const meepAudio = new Audio(meepData);
    const popAudio = new Audio(popData);

    // Audio balance
    sodaAudio.volume = 0.8;
    lightTapAudio.volume = 0.3;
    badTapAudio.volume = 0.4;
    skylightAudio.volume = 0.1;
    transcendAudio.volume = 0.17;
    walkingAudio.volume = 1.0;
    meepAudio.volume = 0.7;
    popAudio.volume = 1.0;

    window.sodaAudio = sodaAudio;
    sodaAudio.loop = true;
    walkingAudio.loop = true;
    meepAudio.preservesPitch = false;

    function utter(txt) {
        let msg = null;
        try {
            msg = new SpeechSynthesisUtterance();
            msg.text = txt.toUpperCase();
            msg.lang = 'ro';
            msg.pitch = 0.0;
            msg.volume = 0.55;
        } catch {}
        try { 
            msg.lang = 'ro';
            window.speechSynthesis.speak(msg);
        } catch{}
    }

    function init() {
        setTimeout(() => { bus.emit('soda-pop'); }, 1000);
        bus.on('soda-pop', () => { sodaAudio.currentTime = 0; sodaAudio.play(); });
        bus.on('utterance', (txt) => { utter(txt); });
        bus.on('interact-fill', () => { lightTapAudio.currentTime = 0; lightTapAudio.play(); });
        bus.on('interact-error', () => { badTapAudio.currentTime = 0; badTapAudio.play(); });
        bus.on('consume', () => { transcendAudio.currentTime = 0; transcendAudio.play(); });
        bus.on('level-clear', () => { transcendAudio.currentTime = 0; transcendAudio.play(); });
        bus.on('spawn-gateway', () => { skylightAudio.currentTime = 0; skylightAudio.play(); });
        bus.on('player-moving', () => { walkingAudio.play(); });
        bus.on('player-stopped', () => { walkingAudio.pause(); });
        bus.on('exploded', () => { popAudio.currentTime = 0; popAudio.play(); });
        bus.on('assign-emote', () => { meepAudio.currentTime = 0; meepAudio.playbackRate=Math.random()*0.4+1.0; meepAudio.play(); });
    }

    return {
        init,
    }
}

export default AudioEngine;