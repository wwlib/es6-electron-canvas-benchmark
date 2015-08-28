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

var _configSukinSprite = require('../config-sukin-sprite');

var _configSukinSprite2 = _interopRequireDefault(_configSukinSprite);

var canvas = document.getElementById('benchmark-canvas');
var canvasContext = canvas.getContext('2d');
var crystalSprite = new _gameSprite2['default']('crystal', null, 20, 20);
crystalSprite.load('./images/crystal.png', onSpriteReady);

var movingObjects = [];
var testEnded = false;
var testSpritesIncrement = _configSukinSprite2['default'].testSpritesIncrement;
var maxRenderedSprites = _configSukinSprite2['default'].maxRenderedSprites;
var testIterationInterval = _configSukinSprite2['default'].testIterationInterval;
var clearCanvasPerFrame = _configSukinSprite2['default'].clearCanvasPerFrame;
var testIteration = 0;
var testIterationElapsedTime = null;
var testSpritesCount = testSpritesIncrement;
var score = 0;

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
        //canvasContext.clearRect(obj.coordsPrev.x, obj.coordsPrev.y, obj.width, obj.height);
        obj.draw(canvasContext, interp);
    }

    fpsDisplay.textContent = Math.round(fps) + ' FPS';
}

function panic() {
    delta = 0;
    console.log('Panic.');
}

function begin() {}

function end(fps) {
    if (fps < 25) {
        box.style.backgroundColor = 'red';
    } else if (fps > 30) {
        box.style.backgroundColor = 'forestgreen';
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
    window.requestAnimationFrame(mainLoop);
}
//# sourceMappingURL=main_sukin_sprite.js.map