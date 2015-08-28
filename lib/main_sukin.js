// Isaac Sukin
// http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing

'use strict';

var box = document.getElementById('box'),
    fpsDisplay = document.getElementById('fpsDisplay'),
    boxPos = 10,
    boxLastPos = 10,
    boxVelocity = 0.08,
    limit = 300,
    lastFrameTimeMs = 0,
    maxFPS = 10,
    delta = 0,
    timestep = 1000 / 60,
    fps = 60,
    framesThisSecond = 0,
    lastFpsUpdate = 0;

function update(delta) {
    boxLastPos = boxPos;
    boxPos += boxVelocity * delta;
    // Switch directions if we go too far
    if (boxPos >= limit || boxPos <= 0) boxVelocity = -boxVelocity;
}

function draw(interp) {
    box.style.left = boxLastPos + (boxPos - boxLastPos) * interp + 'px';
    fpsDisplay.textContent = Math.round(fps) + ' FPS';
}

function panic() {
    delta = 0;
    console.log('Panic.');
}

function begin() {}

function end(fps) {
    if (fps < 25) {
        box.style.backgroundColor = 'blue';
    } else if (fps > 30) {
        box.style.backgroundColor = 'red';
    }
}

function mainLoop(timestamp) {
    // Throttle the frame rate.   
    if (timestamp < lastFrameTimeMs + 1000 / maxFPS) {
        requestAnimationFrame(mainLoop);
        //console.log(`Throttling.`);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    begin(timestamp, delta);

    if (timestamp > lastFpsUpdate + 1000) {
        fps = 0.25 * framesThisSecond + 0.75 * fps;

        lastFpsUpdate = timestamp;
        framesThisSecond = 0;
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

    end(fps);

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
//# sourceMappingURL=main_sukin.js.map