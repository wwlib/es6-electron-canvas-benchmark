// Isaac Sukin
// http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing

// Sprite classes: <andrew@worthwhilegames.org> (http://worthwhilegames.org)

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gameSprite = require('./game/sprite');

var _gameSprite2 = _interopRequireDefault(_gameSprite);

var _gameMovingObject = require('./game/movingObject');

var _gameMovingObject2 = _interopRequireDefault(_gameMovingObject);

var _gameRect = require('./game/rect');

var _gameRect2 = _interopRequireDefault(_gameRect);

var _configSukin = require('../config-sukin');

var _configSukin2 = _interopRequireDefault(_configSukin);

var canvas = document.getElementById('benchmark-canvas');
var canvasContext = canvas.getContext('2d');
var crystalSprite = new _gameSprite2['default']('crystal', null, 20, 20);
crystalSprite.load('./images/crystal.png', onSpriteReady);

var movingObjects = [];
var testEnded = false;
var testSpritesIncrement = _configSukin2['default'].testSpritesIncrement;
var maxRenderedSprites = _configSukin2['default'].maxRenderedSprites;
var testIterationInterval = _configSukin2['default'].testIterationInterval;
var clearCanvasPerFrame = _configSukin2['default'].clearCanvasPerFrame;
var clearSpritePerFrame = _configSukin2['default'].clearSpritePerFrame;
var useSetTimeout = _configSukin2['default'].useSetTimeout;
var throttleFramerate = _configSukin2['default'].throttleFramerate;
var maxFPS = _configSukin2['default'].maxFPS;
var testIteration = 0;
var testIterationElapsedTime = null;
var testSpritesCount = testSpritesIncrement;
var score = 0;

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
    gameFramesThisSecond = 0,
    systemFramesThisSecond = 0,
    lastFpsUpdate = 0;

//box.style.top = '100px';

function update(delta) {
    boxLastPos = boxPos;
    boxPos += boxVelocity * delta;
    // Switch directions if we go too far
    if (boxPos >= limit || boxPos <= 0) boxVelocity = -boxVelocity;

    for (var i = 0; i < maxRenderedSprites; i++) {
        var obj = movingObjects[i];
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

    for (var i = 0; i < maxRenderedSprites; i++) {
        var obj = movingObjects[i];
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
    console.log('Panic.');
}

function begin() {}

function end(gameFPS) {
    if (gameFPS < 25) {
        box.style.backgroundColor = 'red';
    } else if (gameFPS > 30) {
        box.style.backgroundColor = 'forestgreen';
    }
}

function mainLoop(timestamp) {
    if (!timestamp) {
        timestamp = Date.now();
    }
    systemFramesThisSecond++;
    // Throttle the frame rate.   
    if (throttleFramerate && timestamp < lastFrameTimeMs + timestep) {
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

    end(gameFPS);

    if (useSetTimeout) {
        setTimeout(mainLoop, 1);
    } else {
        window.requestAnimationFrame(mainLoop);
    }
}

function onSpriteReady(sprite) {
    console.log('onSpriteReady: ' + sprite.id);
    for (var i = 0; i < maxRenderedSprites; i++) {
        var random_x = Math.floor(Math.random() * 1280);
        var random_y = Math.floor(Math.random() * 720);
        var random_velocity = 0.08; //pixels per timestep
        var moving_object = new _gameMovingObject2['default'](crystalSprite, random_x, random_y, { x: random_velocity, y: 0 });
        moving_object.boundsRect = new _gameRect2['default']({ top: 0, left: -40, width: 1320, height: 680 });
        movingObjects.push(moving_object);
    }

    if (useSetTimeout) {
        setTimeout(mainLoop, 1);
    } else {
        window.requestAnimationFrame(mainLoop);
    }
}
//# sourceMappingURL=main-sukin-sprite.js.map