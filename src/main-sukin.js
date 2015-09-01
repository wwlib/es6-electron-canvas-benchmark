// Isaac Sukin
// http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing

import config from '../config-sukin';

let testSpritesIncrement = config.testSpritesIncrement;
let maxRenderedSprites = config.maxRenderedSprites;
let testIterationInterval = config.testIterationInterval;
let clearCanvasPerFrame = config.clearCanvasPerFrame;
let clearSpritePerFrame = config.clearSpritePerFrame;
let useSetTimeout = config.useSetTimeout;
let maxFPS = config.maxFPS;
let throttleFramerate = config.throttleFramerate;

var box = document.getElementById('box'),
    fpsDisplayGame = document.getElementById('fpsDisplayGame'),
    fpsDisplaySystem = document.getElementById('fpsDisplaySystem'),
    boxPos = 10,
    boxLastPos = 10,
    boxVelocity = 0.08,
    limit = 300,
    lastFrameTimeMs = 0,
    //maxFPS = 60,
    delta = 0,
    timestep = 1000 / maxFPS,
    gameFPS = maxFPS,
    systemFPS = maxFPS,
    framesThisSecond = 0,
    systemFramesThisSecond = 0,
    lastFpsUpdate = 0;

function update(delta) {
    boxLastPos = boxPos;
    boxPos += boxVelocity * delta;
    // Switch directions if we go too far
    if (boxPos >= limit || boxPos <= 0) boxVelocity = -boxVelocity;
}

function draw(interp) {
    box.style.left = (boxLastPos + (boxPos - boxLastPos) * interp) + 'px';
    fpsDisplayGame.textContent = Math.round(gameFPS) + ' Game FPS';
    fpsDisplaySystem.textContent = Math.round(systemFPS) + ' System FPS';
}

function panic() {
    delta = 0;
    console.log(`Panic.`);
}

function begin() {
}

function end(gameFPS) {
    if (gameFPS < 25) {
        box.style.backgroundColor = 'blue';
    }
    else if (gameFPS > 30) {
        box.style.backgroundColor = 'red';
    }
}

function mainLoop(timestamp) {
    if (!timestamp) {
        timestamp = Date.now();
    }
    systemFramesThisSecond++;
    // Throttle the frame rate.    
    if (throttleFramerate && timestamp < lastFrameTimeMs + (timestep)) {
        if (useSetTimeout) {
            setTimeout(mainLoop,1);
        } else {
            window.requestAnimationFrame(mainLoop);
        }
        //console.log(`Throttling.`);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    begin(timestamp, delta);

    if (timestamp > lastFpsUpdate + 1000) {
        gameFPS = 0.25 * framesThisSecond + 0.75 * gameFPS;
        systemFPS = 0.25 * systemFramesThisSecond + 0.75 * systemFPS;

        lastFpsUpdate = timestamp;
        framesThisSecond = 0;
        systemFramesThisSecond = 0;
    }
    framesThisSecond++;

    var numUpdateSteps = 0;
    while (delta >= timestep) {
        update(timestep);
        delta -= timestep;
        if (++numUpdateSteps >= 240) {
            panic();
            break;
        }
    }

    draw(delta / timestep);

    end(gameFPS);

    if (useSetTimeout) {
        setTimeout(mainLoop,1);
    } else {
        window.requestAnimationFrame(mainLoop);
    }
}

if (useSetTimeout) {
    setTimeout(mainLoop,1);
} else {
    window.requestAnimationFrame(mainLoop);
}