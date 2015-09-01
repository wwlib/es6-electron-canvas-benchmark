/**
 * Created by Andrew Rapo on 8/26/15.
 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gameSprite = require('./game/sprite');

var _gameSprite2 = _interopRequireDefault(_gameSprite);

var _gameMovingObject = require('./game/movingObject');

var _gameMovingObject2 = _interopRequireDefault(_gameMovingObject);

var _gameRect = require('./game/rect');

var _gameRect2 = _interopRequireDefault(_gameRect);

var _getTimer = require('./get-timer');

var _getTimer2 = _interopRequireDefault(_getTimer);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

// **** CANVAS ****

var canvas = document.getElementById('benchmark-canvas');
var canvasContext = canvas.getContext('2d');
console.log('canvas: ' + canvas + ', ' + canvasContext);

var spriteList = [];
var spriteCount = 4;
var crystal_sprite = new _gameSprite2['default']('crystal', null, 20, 20);
crystal_sprite.load('./images/crystal.png', onSpriteReady);

var player_sprite = new _gameSprite2['default']('player', null, 20, 20);
player_sprite.load('./images/player.png', onSpriteReady);

var debris_sprite = new _gameSprite2['default']('debris', null, 20, 20);
debris_sprite.load('./images/debris.png', onSpriteReady);

var bullet_sprite = new _gameSprite2['default']('bullet', null, 20, 20);
bullet_sprite.load('./images/bullet.png', onSpriteReady);

var spritesLoaded = 0;
var movingObjects = [];

var testEnded = false;
var testSpritesIncrement = _config2['default'].testSpritesIncrement;
var maxRenderedSprites = _config2['default'].maxRenderedSprites;
var testIterationInterval = _config2['default'].testIterationInterval;
var clearCanvasPerFrame = _config2['default'].clearCanvasPerFrame;
var clearSpritePerFrame = _config2['default'].clearSpritePerFrame;
var useSetTimeout = _config2['default'].useSetTimeout;
var throttleFramerate = _config2['default'].throttleFramerate;
var maxFPS = _config2['default'].maxFPS;
var displayStatsPerFrame = _config2['default'].displayStatsPerFrame;
var testIteration = 0;
var testIterationElapsedTime = null;
var testSpritesCount = testSpritesIncrement;
var score = 0;

var lastFrameTimeMs = null,
    delta = 0,
    timestep = 1000 / maxFPS,
    gameFPS = null,
    systemFPS = null,
    gameFramesThisSecond = 0,
    systemFramesThisSecond = 0,
    lastFpsUpdate = null;

// **** TEST **** //

function updateTestInterval(dTime) {
    if (testIterationElapsedTime === null) {
        testIterationElapsedTime = 0;
        testIteration = 0;
        testSpritesCount = testSpritesIncrement;
        testEnded = false;
        score = 0;
        console.log('Test Started...');
    } else {
        testIterationElapsedTime += dTime;
    }

    if (testIterationElapsedTime >= testIterationInterval) {
        testIterationElapsedTime = 0;
        console.log('Test Iteration ' + testIteration + ' Completed: System FPS: ' + systemFPS + ', Sprites: ' + testSpritesCount);
        score += Math.round(systemFPS);
        testIteration++;
        testSpritesCount += testSpritesIncrement;

        if (testSpritesCount > maxRenderedSprites) {
            testEnded = true;
            console.log('Test Completed!');
            fillText(canvasContext, 'Test Completed! Score: ' + score, '12pt Courier New', 10, 140, '#FFFFFF');
        }
    }
}

// **** MAIN LOOP ****

function step(timestamp) {
    if (!timestamp) {
        timestamp = Date.now();
    }

    if (!lastFrameTimeMs) {
        lastFrameTimeMs = timestamp;
    }

    if (!lastFpsUpdate) {
        lastFpsUpdate = timestamp;
    }

    systemFramesThisSecond++;
    gameFramesThisSecond++;

    var dTime = timestamp - lastFrameTimeMs;
    //console.log(`${timestamp}: ${dTime}`);
    lastFrameTimeMs = timestamp;

    if (clearCanvasPerFrame) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }

    updateTestInterval(dTime);
    if (!testEnded) {
        for (var i = 0; i < testSpritesCount; i++) {
            var obj = movingObjects[i];
            obj.update(dTime);
            if (!obj.inBounds) {
                obj.coords.x = obj.bounds.left;
            }
            obj.draw(canvasContext, null);
        }
        if (useSetTimeout) {
            setTimeout(step, 1);
        } else {
            window.requestAnimationFrame(step);
        }
    }

    if (timestamp > lastFpsUpdate + 1000) {
        if (!gameFPS) gameFPS = gameFramesThisSecond;
        if (!systemFPS) systemFPS = systemFramesThisSecond;

        gameFPS = 0.25 * gameFramesThisSecond + 0.75 * gameFPS;
        systemFPS = 0.25 * systemFramesThisSecond + 0.75 * systemFPS;

        lastFpsUpdate = timestamp;
        gameFramesThisSecond = 0;
        systemFramesThisSecond = 0;
    }

    if (displayStatsPerFrame) {
        fillText(canvasContext, 'Game FPS: ' + Math.round(gameFPS), '12pt Courier New', 10, 60, '#FFFFFF');
        fillText(canvasContext, 'System FPS: ' + Math.round(systemFPS), '12pt Courier New', 10, 80, '#FFFFFF');
        fillText(canvasContext, 'dTime: ' + dTime, '12pt Courier New', 10, 100, '#FFFFFF');
        fillText(canvasContext, 'Sprites: ' + testSpritesCount, '12pt Courier New', 10, 120, '#FFFFFF');
    }
}

// Counts the # of sprites that have been successfully loaded
// Poor man's asset manager
function onSpriteReady(sprite) {
    console.log('onSpriteReady: ' + sprite.id);
    spriteList.push(sprite);
    spritesLoaded++;
    if (spritesLoaded >= spriteCount) {
        for (var i = 0; i < maxRenderedSprites; i++) {
            var random_sprite_index = Math.floor(Math.random() * spriteCount);
            var random_sprite = spriteList[random_sprite_index];
            var random_x = Math.floor(Math.random() * 1280);
            var random_y = Math.floor(Math.random() * 720);
            var random_velocity = 0.04 + Math.random() * 0.04; //320 + Math.floor(Math.random() * 320);
            var moving_object = new _gameMovingObject2['default'](random_sprite, random_x, random_y, { x: random_velocity, y: 0 });
            moving_object.boundsRect = new _gameRect2['default']({ top: 0, left: -40, width: 1320, height: 720 });
            movingObjects.push(moving_object);
        }

        if (useSetTimeout) {
            //lastFrameTimeMs = Date.now();
            //lastFpsUpdate = Date.now();
            setTimeout(step, 1);
        } else {
            //lastFrameTimeMs = 0;
            //lastFpsUpdate = 0;
            window.requestAnimationFrame(step);
        }
    }
}

function fillText(ctx, txt, font, x, y, color) {
    ctx.save();
    if (color) ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(txt, x, y);
    ctx.restore();
}
//# sourceMappingURL=main.js.map