/**
 * Created by Andrew Rapo on 8/26/15.
 */

import Sprite from './game/sprite';
import MovingObject from './game/movingObject';
import Rect from './game/rect';
import getTimer from './get-timer';
import config from '../config';

// **** CANVAS ****

let canvas = document.getElementById("benchmark-canvas");
let canvasContext = canvas.getContext("2d");
console.log("canvas: " + canvas + ", " + canvasContext);

let spriteList = [];
let spriteCount = 4;
let crystal_sprite = new Sprite("crystal", null, 20, 20);
crystal_sprite.load("./images/crystal.png", onSpriteReady);

let player_sprite = new Sprite("player", null, 20, 20);
player_sprite.load("./images/player.png", onSpriteReady);

let debris_sprite = new Sprite("debris", null, 20, 20);
debris_sprite.load("./images/debris.png", onSpriteReady);

let bullet_sprite = new Sprite("bullet", null, 20, 20);
bullet_sprite.load("./images/bullet.png", onSpriteReady);

let spritesLoaded = 0;
let movingObjects = [];
let prevTimestamp = 0;
let frameTime = 0;
let frameRate = 0;
let frameCount = 0;
let lastFrameTime = getTimer();
let lastFPSUpdateTime = getTimer();



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


// **** TEST **** //

function updateTestInterval(dTime) {
    if (testIterationElapsedTime === null) {
        testIterationElapsedTime = 0;
        testIteration = 0;
        testSpritesCount = testSpritesIncrement;
        testEnded = false;
        score = 0;
        console.log(`Test Started...`);
    } else {
        testIterationElapsedTime += dTime;
    }

    if (testIterationElapsedTime >= testIterationInterval) {
        testIterationElapsedTime = 0;
        console.log(`Test Iteration ${testIteration} Completed: FPS: ${frameRate}, Sprites: ${testSpritesCount}`);
        score += frameRate;
        testIteration++;
        testSpritesCount += testSpritesIncrement;

        if (testSpritesCount > maxRenderedSprites) {
            testEnded = true;
            console.log(`Test Completed!`);
            fillText(canvasContext, "Test Completed! Score: " + score, "12pt Courier New", 10, 120, "#FFFFFF");
        }
    }

}

// **** MAIN LOOP ****

function step(timestamp) {


    frameCount++;
    let now = getTimer();
    let dTime = now - lastFrameTime;

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    updateTestInterval(dTime);
    if (!testEnded) {
        for (let i=0; i < testSpritesCount; i++) {
            let obj = movingObjects[i];
            obj.update(dTime);
            if (!obj.inBounds) {
                obj.coords.x = obj.bounds.left;
            }
            obj.draw(canvasContext, null);
        }
        if (useSetTimeout) {
            setTimeout(step,1);
        } else {
            window.requestAnimationFrame(step);
        }
    }

    let frameRateInterval = now - lastFPSUpdateTime;
    if (frameRateInterval > 1000)
    {
        frameRate = Math.floor(1000 / (frameRateInterval / frameCount));
        lastFPSUpdateTime = now;
        frameCount = 0;
    }
    lastFrameTime = now;

    fillText(canvasContext, "FPS: " + frameRate, "12pt Courier New", 10, 60, "#FFFFFF");
    fillText(canvasContext, "dTime: " + dTime, "12pt Courier New", 10, 80, "#FFFFFF");
    fillText(canvasContext, "Sprites: " + testSpritesCount, "12pt Courier New", 10, 100, "#FFFFFF");


}

function step2(timestamp) {
    crystal_sprite.x++;
    crystal_sprite.draw(canvasContext);
    if (useSetTimeout) {
        setTimeout(step,1);
    } else {
        window.requestAnimationFrame(step);
    }
}

// Counts the # of sprites that have been successfully loaded
// Poor man's asset manager
function onSpriteReady(sprite) {
    console.log("onSpriteReady: " + sprite.id);
    spriteList.push(sprite);
    spritesLoaded++;
    if (spritesLoaded >= spriteCount) {
        for (let i=0; i< maxRenderedSprites; i++) {
            let random_sprite_index = Math.floor(Math.random() * spriteCount);
            let random_sprite = spriteList[random_sprite_index];
            let random_x = Math.floor(Math.random() * 1280);
            let random_y = Math.floor(Math.random() * 720);
            let random_velocity = 0.04 + Math.random() * 0.04; //320 + Math.floor(Math.random() * 320);
            let moving_object = new MovingObject(random_sprite, random_x, random_y, {x: random_velocity, y: 0});
            moving_object.boundsRect = new Rect({top: 0, left: -40, width: 1320, height: 720});
            movingObjects.push(moving_object);
        }
        if (useSetTimeout) {
            setTimeout(step,1);
        } else {
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