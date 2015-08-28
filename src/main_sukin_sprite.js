// Isaac Sukin
// http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing

// Sprite classes: <andrew@worthwhilegames.org> (http://worthwhilegames.org)

import Sprite from './game/sprite';
import MovingObject from './game/movingObject';
import Rect from './game/rect';

let canvas = document.getElementById("benchmark-canvas");
let canvasContext = canvas.getContext("2d");
let crystalSprite = new Sprite("crystal", null, 20, 20);
crystalSprite.load("./images/crystal.png", onSpriteReady);

var box = document.getElementById('box'),
    fpsDisplay = document.getElementById('fpsDisplay'),
    boxPos = 10,
    boxLastPos = 10,
    boxVelocity = 0.08,
    limit = 300,
    lastFrameTimeMs = 0,
    maxFPS = 60,
    delta = 0,
    timestep = 1000 / 60,
    fps = 60,
    framesThisSecond = 0,
    lastFpsUpdate = 0;

//box.style.top = '100px';

function update(delta) {
    boxLastPos = boxPos;
    boxPos += boxVelocity * delta;
    // Switch directions if we go too far
    if (boxPos >= limit || boxPos <= 0) boxVelocity = -boxVelocity;
}

function draw(interp) {
    box.style.left = (boxLastPos + (boxPos - boxLastPos) * interp) + 'px';

    canvasContext.clearRect(crystalSprite.x, crystalSprite.y, crystalSprite.width, crystalSprite.height);
    crystalSprite.x = (boxLastPos + (boxPos - boxLastPos) * interp);
    crystalSprite.draw(canvasContext);

    fpsDisplay.textContent = Math.round(fps) + ' FPS';
}

function panic() {
    delta = 0;
    console.log(`Panic.`);
}

function begin() {
}

function end(fps) {
    if (fps < 25) {
        box.style.backgroundColor = 'blue';
    }
    else if (fps > 30) {
        box.style.backgroundColor = 'red';
    }
}

function mainLoop(timestamp) {
    // Throttle the frame rate.    
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
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


function onSpriteReady(sprite) {
    console.log("onSpriteReady: " + sprite.id);
    crystalSprite.y = 60;
    window.requestAnimationFrame(mainLoop);
}
