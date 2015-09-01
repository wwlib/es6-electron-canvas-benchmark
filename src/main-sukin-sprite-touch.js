// Isaac Sukin
// http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing

// Sprite classes: <andrew@worthwhilegames.org> (http://worthwhilegames.org)

import Sprite from './game/sprite';
import MovingObject from './game/movingObject';
import Rect from './game/rect';
import config from '../config-sukin';

let canvas = document.getElementById("benchmark-canvas");
let canvasContext = canvas.getContext("2d");
let crystalSprite = new Sprite("crystal", null, 20, 20);
crystalSprite.load("./images/crystal.png", onSpriteReady);
let debris_sprite = new Sprite("debris", null, 20, 20);
debris_sprite.load("./images/debris.png", onSpriteReady);
let numSpritesToLoad = 2;
let numSpritesLoaded = 0;

let movingObjects = [];
let testEnded = false;
let testSpritesIncrement = config.testSpritesIncrement;
let maxRenderedSprites = config.maxRenderedSprites;
let testIterationInterval = config.testIterationInterval;
let clearCanvasPerFrame = config.clearCanvasPerFrame;
let clearSpritePerFrame = config.clearSpritePerFrame;
let useSetTimeout = config.useSetTimeout;
let throttleFramerate = config.throttleFramerate;
let maxFPS = config.maxFPS;
let testIteration = 0;
let testIterationElapsedTime = null;
let testSpritesCount = testSpritesIncrement;
let score = 0;

// Touch
let drawCommands = [];

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
    gameFPS = null,
    systemFPS = null,
    gameFramesThisSecond = 0,
    systemFramesThisSecond = 0,
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

    fpsDisplayGame.textContent = Math.round(gameFPS) + ' gameFPS';
    fpsDisplaySystem.textContent = Math.round(systemFPS) + ' systemFPS';
}

function panic() {
    delta = 0;
    console.log(`Panic.`);
}

function begin() {
}

function end(gameFPS) {
    if (gameFPS < 25) {
        box.style.backgroundColor = 'red';
    }
    else if (gameFPS > 30) {
        box.style.backgroundColor = 'forestgreen';
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
            setTimeout(mainLoop, 1);
        } else {
            window.requestAnimationFrame(mainLoop);
        }
        //console.log(`Throttling.`);
        return;
    }
    gameFramesThisSecond++;

    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    begin(timestamp, delta);

    if (timestamp > lastFpsUpdate + 1000) {
        if (!gameFPS) gameFPS = gameFramesThisSecond;
        if (!systemFPS) systemFPS = systemFramesThisSecond;

        gameFPS = 0.25 * gameFramesThisSecond + 0.75 * gameFPS;
        systemFPS = 0.25 * systemFramesThisSecond + 0.75 * systemFPS;


        lastFpsUpdate = timestamp;
        gameFramesThisSecond = 0;
        systemFramesThisSecond = 0;
    }

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

    drawCommands.forEach(command => {
        debris_sprite.x = command.x;
        debris_sprite.y = command.y;
        debris_sprite.draw(canvasContext);
    });
    drawCommands = [];

    end(gameFPS);

    if (useSetTimeout) {
        setTimeout(mainLoop, 1);
    } else {
        window.requestAnimationFrame(mainLoop);
    }
}


function onSpriteReady(sprite) {
    console.log("onSpriteReady: " + sprite.id);
    numSpritesLoaded++;
    if (numSpritesLoaded >= numSpritesToLoad) {
        for (let i = 0; i < maxRenderedSprites; i++) {
            let random_x = Math.floor(Math.random() * 1280);
            let random_y = Math.floor(Math.random() * 720);
            let random_velocity = 0.08; //pixels per timestep
            let moving_object = new MovingObject(crystalSprite, random_x, random_y, {x: random_velocity, y: 0});
            moving_object.boundsRect = new Rect({top: 0, left: -40, width: 1320, height: 680});
            movingObjects.push(moving_object);
        }

        setupMouseInput();

        if (useSetTimeout) {
            lastFrameTimeMs = Date.now();
            lastFpsUpdate = Date.now();
            setTimeout(mainLoop, 1);
        } else {
            lastFrameTimeMs = 0;
            lastFpsUpdate = 0;
            window.requestAnimationFrame(mainLoop);
        }
    }
}

// Mouse/Touch Handling

function setupMouseInput() {
    document.onmousedown = mouseDown;
    document.onmouseup = mouseUp;
    document.onmousemove = mouseMove;
}

function setupTouchInput() {
    if ("ontouchstart" in window) {
        canvas.addEventListener("touchstart", touchStart);
        canvas.addEventListener("touchend", touchEnd);
        canvas.addEventListener("touchmove", touchMove);
    }
}

//// GLOBAL EVENTS

function mouseDown(e) {
    if (e) {
        drawCommands.push({x:e.pageX, y:e.pageY});
    }
}

function mouseUp(e) {
    if (e) {
    }
}

function mouseMove(e) {
    if (e) {
        drawCommands.push({x:e.pageX, y:e.pageY});
    }
}

//// TOUCH EVENTS

function touchStart(e) {
    //console.log(`touchStart: ${e.pageX}, ${e.pageY}`);
    e.preventDefault();
    var touch = e.targetTouches[0];
    mouseDown(touch);
}

function touchEnd(e) {
    //console.log(`touchEnd: ${e.pageX}, ${e.pageY}`);
    e.preventDefault();
    mouseUp(e);
}

function touchMove(e) {
    //console.log(`touchMove: ${e.pageX}, ${e.pageY}`);
    e.preventDefault();
    var touch = e.targetTouches[0];
    mouseMove(touch);
}