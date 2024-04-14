import * as bus from './bus';
import { EMOTE } from "./emote-enum";
import { getObjectsByTag } from "./engine";

function SoulManager() {
    let soulRequests = new Map();
    let tick = 0;
    let availableEmotes = [EMOTE.TRIANGLE, EMOTE.YOTA, EMOTE.CIRCLE, EMOTE.WAVE];

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

    function render(ctx) {
    }

    function update(dT) {
        // Run processing tick once per second
        tick += dT;
        if (tick < 1) {
            return;
        }
        tick -= 1;

        // Logic
        const numAssignments = getNumAssignments();
        if (numAssignments == 0) {
            assignSoulEmote(getRandomFreeSoul(), getRandomEmote());
        } else {
            if (Math.random() > 0.5) {
                assignSoulEmote(getRandomFreeSoul(), getRandomEmote());
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