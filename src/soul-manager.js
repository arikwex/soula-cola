import * as bus from './bus';
import { EMOTE } from "./emote-enum";
import { add, getObjectsByTag } from "./engine";
import Gateway from './gateway';

function SoulManager() {
    let soulRequests = new Map();
    let tick = 0;
    let availableEmotes = [EMOTE.TRIANGLE, EMOTE.YOTA, EMOTE.CIRCLE, EMOTE.WAVE];
    let gatewayHistory = [];

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
        add(new Gateway(sx, sy, emote));
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
        if (getNumGateways() < availableEmotes.length) {
            spawnRandomGateway();
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