// Isaac Sukin
// http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing

// Sprite classes: <andrew@worthwhilegames.org> (http://worthwhilegames.org)

import Sprite from './game/sprite';
import MovingObject from './game/movingObject';
import Rect from './game/rect';
import config from '../config-sukin-sprite';

let canvas = document.getElementById("benchmark-canvas");
let canvasContext = canvas.getContext("2d");
let crystalSprite = new Sprite("crystal", null, 20, 20);
crystalSprite.load("./images/crystal.png", onSpriteReady);

let movingObjects = [];
let testEnded = false;
let testSpritesIncrement = config.testSpritesIncrement;
let maxRenderedSprites = config.maxRenderedSprites;
let testIterationInterval = config.testIterationInterval;
let clearCanvasPerFrame = config.clearCanvasPerFrame;
let clearSpritePerFrame = config.clearSpritePerFrame;
let useSetTimeout = config.useSetTimeout;
let testIteration = 0;
let testIterationElapsedTime = null;
let testSpritesCount = testSpritesIncrement;
let score = 0;

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


    for (let i=0; i < maxRenderedSprites; i++) {
        let obj = movingObjects[i];
        obj.update(delta);
        if (!obj.inBounds) {
            obj.coords.x = obj.bounds.left;
            obj.coordsPrev.x = obj.bounds.left;
        }
    }
}

function draw(interp) {

    if (clearCanvasPerFrame) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }

    //box.style.left = (boxLastPos + (boxPos - boxLastPos) * interp) + 'px';

    //canvasContext.clearRect(crystalSprite.x, crystalSprite.y, crystalSprite.width, crystalSprite.height);
    //crystalSprite.x = (boxLastPos + (boxPos - boxLastPos) * interp);
    //crystalSprite.draw(canvasContext);

    for (let i=0; i < maxRenderedSprites; i++) {
        let obj = movingObjects[i];
        //obj.coords.x = (boxLastPos + (boxPos - boxLastPos) * interp);
        if (clearSpritePerFrame) {
            canvasContext.clearRect(obj.coordsPrev.x, obj.coordsPrev.y, obj.width, obj.height);
        }
        obj.draw(canvasContext, interp);
    }

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
        box.style.backgroundColor = 'red';
    }
    else if (fps > 30) {
        box.style.backgroundColor = 'forestgreen';
    }
}

function mainLoop(timestamp) {
    if (!timestamp) {
        timestamp = Date.now();
    }
    // Throttle the frame rate.    
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        if (useSetTimeout) {
            setTimeout(mainLoop, 1);
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

    if (useSetTimeout) {
        setTimeout(mainLoop, 1);
    } else {
        window.requestAnimationFrame(mainLoop);
    }
}


function onSpriteReady(sprite) {
    console.log("onSpriteReady: " + sprite.id);
    for (let i=0; i< maxRenderedSprites; i++) {
        let random_x = Math.floor(Math.random() * 1280);
        let random_y = Math.floor(Math.random() * 720);
        let random_velocity = 0.08; //pixels per timestep
        let moving_object = new MovingObject(crystalSprite, random_x, random_y, {x: random_velocity, y: 0});
        moving_object.boundsRect = new Rect({top: 0, left: -40, width: 1320, height: 680});
        movingObjects.push(moving_object);
    }


    if (useSetTimeout) {
        setTimeout(mainLoop, 1);
    } else {
        window.requestAnimationFrame(mainLoop);
    }
}
