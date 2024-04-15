import { canvas, ctx, retainTransform } from './canvas';

let gameObjects = [];
let gameObjectsByTag = {};
const objectsToRemove = [];
let lastFrameMs = 0;

function tick(currentFrameMs) {
    const dT = Math.min((currentFrameMs - lastFrameMs) * 0.001, 0.018);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Configure default camera
    const zoom = Math.min(
        canvas.width / 1100,
        canvas.height / 800,
    );
    ctx.setTransform(zoom, 0, 0, zoom, canvas.width * 0.5, canvas.height * 0.54);

    resort();
    retainTransform(() => {
        objectsToRemove.length = 0;
        gameObjects.map((g) => { if (g.update?.(dT)) { objectsToRemove.push(g); } });
        if (objectsToRemove.length) { remove(objectsToRemove); }
        gameObjects.map((g) => { g.render?.(ctx); });
        lastFrameMs = currentFrameMs;
    });
    requestAnimationFrame(tick);
}

function add(obj) {
    if (!obj.inView) { obj.inView=()=>1 }
    gameObjects.push(obj);
    resort();
    obj.tags?.map((tag) => {
        gameObjectsByTag[tag] = (gameObjectsByTag[tag] ?? []);
        gameObjectsByTag[tag].push(obj);
    });
}

function resort() {
    gameObjects.sort((a, b) => (a.order || 0) - (b.order || 0));
}

function arrayRemove(list, valuesToEvict) {
    valuesToEvict.forEach((obj) => { obj.onRemove?.(); });
    return list.filter((g) => !valuesToEvict.includes(g));
}

function remove(objList) {
    gameObjects = arrayRemove(gameObjects, objList);
    objList.map((obj) => {
        obj.tags?.map((tag) => {
            gameObjectsByTag[tag] = arrayRemove(gameObjectsByTag[tag], [obj]);
        });
    });
}

function clear() {
    gameObjects.forEach((obj) => { obj.onRemove?.(); });
    gameObjects = [];
}

function getObjectsByTag(tag) {
    return gameObjectsByTag[tag] || [];
}

requestAnimationFrame(tick);

export {
    add,
    remove,
    clear,
    resort,
    getObjectsByTag,
};