package {

import flash.display.*;
import flash.events.*;
import flash.text.*;
import flash.utils.*;

[SWF(backgroundColor=0xEEEADB)]

/**
 *   A simple harness for an AS3 test
 *   @author Jackson Dunstan
 */
public class SimpleTestHarness extends Sprite {
    /** Radius of the particle */
    private static const PARTICLE_RADIUS:Number = 50;

    /** Sprite we're going to animate around */
    private var __particle:Sprite;

    /** The particle's velocity in the X */
    private var __velocityX:Number;

    /** The particle's velocity in the Y */
    private var __velocityY:Number;

    /**
     *   Initialize the application
     */
    private function init():void {
        // Test out timing
        beginTiming();
        var sum:uint = 0;
        for (var i:uint = 0; i < 1000000; ++i) {
            sum += i;
        }
        endTiming("Time to sum the first million positive integers");

        // Test out something to update
        __particle = new Sprite();
        __particle.graphics.beginFill(0x261c13);
        __particle.graphics.drawCircle(0, 0, PARTICLE_RADIUS);
        __particle.graphics.endFill();
        addChild(__particle);
        launchParticle();
    }

    /**
     *   Update based on elapsed time
     *   @param elapsed Number of milliseconds elapsed since the last update
     */
    private function update(elapsed:int):void {
        var pixelsToMove:Number = (200 * elapsed) / 1000;
        __particle.x += __velocityX * pixelsToMove;
        __particle.y += __velocityY * pixelsToMove;
        if (__particle.x < -PARTICLE_RADIUS
            || __particle.y < -PARTICLE_RADIUS
            || __particle.x > stage.stageWidth + PARTICLE_RADIUS
            || __particle.y > stage.stageHeight + PARTICLE_RADIUS) {
            log("resetting particle");
            launchParticle();
        }
    }

    /**
     *   Launch the particle
     */
    private function launchParticle():void {
        __particle.x = stage.stageWidth / 2;
        __particle.y = stage.stageWidth / 2;
        __velocityX = Math.random() - 1;
        __velocityY = Math.random() - 1;
    }

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    // Test harness code is below. You shouldn't have to change it for most
    // tests you do.
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    /** Last time we updated FPS */
    private var __lastFPSUpdateTime:uint;

    /** Last time we entered a frame */
    private var __lastFrameTime:uint;

    /** Count of frames since the last time we updated the FPS */
    private var __frameCount:uint;

    /** Framerate display */
    private var __framerate:TextField;

    /** Text field to show log messages */
    private var __logger:TextField;

    /** Time when we started timing */
    private var __beginTime:int;

    /**
     *   Application entry point. You shouldn't have to change this function
     *   for most tests.
     */
    public function SimpleTestHarness() {
        // Setup stage
        stage.align = StageAlign.TOP_LEFT;
        stage.scaleMode = StageScaleMode.NO_SCALE;

        var format:TextFormat = new TextFormat();
        format.font = "_sans";

        // Setup framerate display
        __framerate = new TextField();
        __framerate.autoSize = TextFieldAutoSize.LEFT;
        __framerate.background = true;
        __framerate.backgroundColor = 0xEEEADB;
        __framerate.selectable = false;
        __framerate.text = "Gathering FPS data...";
        __framerate.setTextFormat(format);
        __framerate.defaultTextFormat = format;
        addChild(__framerate);
        addEventListener(Event.ENTER_FRAME, onEnterFrame);

        // Setup logger
        __logger = new TextField();
        __logger.y = __framerate.height;
        __logger.width = stage.stageWidth;
        __logger.height = stage.stageHeight - __logger.y;
        __logger.setTextFormat(format);
        __logger.defaultTextFormat = format;
        addChild(__logger);

        init();
    }

    /**
     *   Start timing
     */
    private function beginTiming():void {
        __beginTime = getTimer();
    }

    /**
     *   End timing
     *   @param taskName Name of the task that was timed
     */
    private function endTiming(taskName:String):void {
        var elapsed:int = getTimer() - __beginTime;
        log(taskName + ": " + elapsed);
    }

    /**
     *   Log a message
     *   @param msg Message to log
     */
    private function log(msg:*):void {
        __logger.appendText(msg + "\n");
        __logger.scrollV = __logger.maxScrollV;
    }

    /**
     *   Callback for when a frame is entered. You shouldn't have to change
     *   this function for most tests.
     *   @param ev ENTER_FRAME event
     */
    private function onEnterFrame(ev:Event):void {
        __frameCount++;
        var now:int = getTimer();
        var dTime:int = now - __lastFrameTime;
        var elapsed:int = now - __lastFPSUpdateTime;
        if (elapsed > 1000) {
            var framerateValue:Number = 1000 / (elapsed / __frameCount);
            if (__framerate.visible) {
                __framerate.text = "FPS: " + framerateValue.toFixed(4);
            }
            __lastFPSUpdateTime = now;
            __frameCount = 0;
        }
        __lastFrameTime = now;
        update(dTime);
    }
}
}