import * as bus from './bus';
import { EMOTE } from "./emote-enum";
import { add, getObjectsByTag } from "./engine";
import Gateway from './gateway';

const MODE = {
    PLAYING: 0,
    ENDED: 1,
}

function SoulManager() {
    let soulRequests = new Map();
    let tick = 0;
    let availableEmotes = [EMOTE.TRIANGLE, EMOTE.CIRCLE];//, EMOTE.YOTA, EMOTE.WAVE];
    let gatewayHistory = [];
    let gameMode = MODE.PLAYING;

    function assignSoulEmote(soul, emote) {
        if (soul == null) {
            return;
        }
        soulRequests.set(soul, {
            emote,
            time: Date.now(),
        });
        bus.emit('assign-emote', { soul, emote });
    }

    function getSoulEmote(soul) {
        return soulRequests.get(soul);
    }

    function isSoulAssigned(soul) {
        return getSoulEmote(soul) !== undefined;
    }

    function getNumAssignments() {
        return soulRequests.size;
    }

    function getNumSouls() {
        return getObjectsByTag('soul').length;
    }

    function clearAssignement(soul) {
        return soulRequests.delete(soul);
    }

    function clearAll() {
        soulRequests.clear();
    }
    
    function getRandomFreeSoul() {
        const souls = getObjectsByTag('soul');
        const freeSouls = souls.filter((x) => !isSoulAssigned(x));
        if (freeSouls.length == 0) {
            return null;
        }
        return freeSouls[Math.floor(Math.random() * freeSouls.length)];
    }
    
    function getRandomEmote() {
        return availableEmotes[Math.floor(Math.random() * availableEmotes.length)];
    }

    function getGatewayRandomEmote() {
        let filteredEmotes = availableEmotes.filter((e) => {
            let count = 0;
            for (let i = 0; i < gatewayHistory.length; i++) {
                if (gatewayHistory[i] == e) {
                    count += 1;
                }
            }
            return count < 2;
        });
        if (filteredEmotes.length == 0) {
            filteredEmotes = availableEmotes;
        }
        return filteredEmotes[Math.floor(Math.random() * filteredEmotes.length)];
    }

    function getNumGateways() {
        return getObjectsByTag('gateway').length;
    }

    function spawnRandomGateway() {
        const emote = getGatewayRandomEmote();
        gatewayHistory.push(emote);
        if (gatewayHistory.length > 6) {
            gatewayHistory.shift();
        }
        const gateways = getObjectsByTag('gateway');
        let sx = 0;
        let sy = 0;
        for (let i = 0; i < 200; i++ ) {
            sx = (Math.random() - 0.5) * 800;
            sy = (Math.random() - 0.5) * 600;
            const CM = Math.sqrt(sx * sx + sy * sy * 2.8);
            if (CM > 390) {
                sx = 390 * sx / CM;
                sy = 390 * sy / CM;
            }
            let isValid = true;
            for (let j = 0; j < gateways.length; j++) {
                if (gateways[j].isTooCloseToGate(sx, sy)) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                break;
            }
        }
        bus.emit('spawn-gateway');
        add(new Gateway(sx, sy, emote, generateChallengeWord()));
    }

    function randomSelection(a) {
        return a[Math.floor(Math.random() * a.length)];
    }

    function generateChallengeWord() {
        const difficulty = 2;
        const starterVowels = ['A','E','I','O','U'];
        const syllabs = [
            ['BA', 'CA', 'CHA', 'FA', 'GA', 'HA', 'JA', 'KA', 'LA', 'MA', 'NA', 'PA', 'QA','RA', 'SA', 'SHA', 'TA', 'THA', 'VA', 'XA', 'ZA'],
            ['BE', 'FE', 'DE', 'GE', 'HE', 'JE', 'KE', 'LE', 'ME', 'NE', 'PE', 'QE' ,'RE', 'SE', 'SHE', 'TE', 'THE', 'VE', 'XE', 'ZE'],
            ['BI', 'CHI', 'DI', 'FI', 'JI', 'KI', 'LI', 'MI', 'QI', 'RI', 'SI', 'SHI', 'TI', 'THI', 'VI', 'XI'],
            ['BO', 'CO', 'CHO', 'JO', 'KO', 'LO', 'MO', 'NO', 'QO','RO', 'SO', 'SHO', 'TO', 'THO', 'VO', 'WO', 'XO'],
            ['BU', 'CU', 'DU', 'GU', 'HU', 'KU', 'LU', 'MU', 'NU', 'QU', 'RU', 'SU', 'SHU', 'TU', 'THU', 'VU', 'XU', 'ZU'],
        ];
        const consonants = ['B', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'S', 'T', 'V', 'Z']
        let word = "";
        if (Math.random() > 0.9) {
            word += randomSelection(starterVowels);
        }
        for (let i = 0; i < difficulty; i++) {
            word += randomSelection(randomSelection(syllabs));
            if (Math.random() > 0.8) {
                word += randomSelection(consonants);
            }
        }
        return word.toUpperCase();
    }

    function render(ctx) {
    }

    function update(dT) {
        // Run processing tick once per second
        tick += dT;
        if (tick < 1) {
            return;
        }
        tick -= 1;

        // Logic for emote assignment
        const numAssignments = getNumAssignments();
        if (numAssignments == 0) {
            assignSoulEmote(getRandomFreeSoul(), getRandomEmote());
        } else {
            if (Math.random() > 0.75) {
                assignSoulEmote(getRandomFreeSoul(), getRandomEmote());
            }
        }

        // Logic for gateway spawn
        const numSouls = getNumSouls();

        if (gameMode == MODE.PLAYING) {
            if (numSouls > 0 && getNumGateways() < availableEmotes.length && Math.random() > 0.75) {
                spawnRandomGateway();
            }
            if (numSouls == 0) {
                gameMode = MODE.ENDED;
                bus.emit('level-clear');
                clearAll();
            }
        }
    }

    return {
        update,
        render,
        tags: ['soul-manager'],
        order: 0,
    };
}

export default SoulManager;