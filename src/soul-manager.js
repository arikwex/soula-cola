import * as bus from './bus';
import { EMOTE } from "./emote-enum";
import { add, getObjectsByTag } from "./engine";
import Gateway from './gateway';
import Soda from './soda';
import Soul from './soul';

const MODE = {
    WAITING_FOR_SOULS: 0,
    PLAYING: 1,
    NEED_COLA: 2,
}

function SoulManager() {
    let soulRequests = new Map();
    let tick = 0;
    let availableEmotes = [EMOTE.TRIANGLE, EMOTE.CIRCLE];//, EMOTE.YOTA, EMOTE.WAVE];
    let gatewayHistory = [];
    let gameMode = MODE.NEED_COLA;
    let level = 0;
    let gameOver = false;

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
        let difficulty = 1;
        if (level <= 1) { difficulty = 2; }
        else if (level == 2) { difficulty = 2; }
        else if (level == 3) { difficulty = Math.floor(1 + Math.random() * 2.5); }
        else if (level <= 6) { difficulty = Math.floor(1 + Math.random() * 2.9); }
        else { difficulty = Math.floor(2 + Math.random() * 2.3); }

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
        if (gameOver) {
            return;
        }

        // Run processing tick once per second
        tick += dT;
        if (tick < 1) {
            return;
        }
        tick -= 1;
        const numSouls = getNumSouls();

        // Logic for emote assignment
        if (numSouls > 0) {
            if (gameMode == MODE.WAITING_FOR_SOULS) {
                gameMode = MODE.PLAYING;
            }
            const numAssignments = getNumAssignments();
            if (numAssignments == 0) {
                assignSoulEmote(getRandomFreeSoul(), getRandomEmote());
            } else {
                if (Math.random() > 0.75) {
                    assignSoulEmote(getRandomFreeSoul(), getRandomEmote());
                }
            }
        }

        // Logic for gateway spawn
        if (gameMode == MODE.PLAYING) {
            if (numSouls > 0 && getNumGateways() < availableEmotes.length && Math.random() > 0.5) {
                spawnRandomGateway();
            }
            if (numSouls == 0) {
                gameMode = MODE.NEED_COLA;
                bus.emit('level-clear');
                clearAll();

                setTimeout(() => {
                    add(new Gateway(0, 0, EMOTE.SOULA_COLA, 'SOLUKI'));
                    add(new Soda(0, 0));
                }, 2000);
            }
        }
    }

    function onSodaPop() {
        gameMode = MODE.WAITING_FOR_SOULS;
        level += 1;
        if (level <= 1) {
            availableEmotes = [EMOTE.TRIANGLE];
        } else if (level == 2) {
            availableEmotes = [EMOTE.TRIANGLE, EMOTE.CIRCLE];
        } else if (level == 3) {
            availableEmotes = [EMOTE.TRIANGLE, EMOTE.CIRCLE, EMOTE.YOTA];
        } else {
            availableEmotes = [EMOTE.TRIANGLE, EMOTE.CIRCLE, EMOTE.YOTA, EMOTE.WAVE];
        }
    }

    function onSpawnSouls() {
        for (let i = 0; i < Math.min(level * 3, 20); i++) {
            add(new Soul((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80));
        }
    }

    function onGG() {
        gameOver = true;
    }

    bus.on('soda-pop', onSodaPop);
    bus.on('spawn-souls', onSpawnSouls);
    bus.on('game-over', onGG);
    function onRemove() {
        bus.off('soda-pop', onSodaPop);
        bus.off('spawn-souls', onSpawnSouls);
        bus.off('game-over', onGG);
    }

    return {
        update,
        render,
        onRemove,
        tags: ['soul-manager'],
        order: 0,
    };
}

export default SoulManager;