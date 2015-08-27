/**
 * Created by andrew on 3/28/15.
 */

import MovingObject from './movingObject';
import SoundManager from './soundManager';

class BouncingObject extends MovingObject {

    constructor(sprite, x, y, velocity, x_period, y_period) {
        if (!velocity) {
            velocity = {"x": 1, "y": 0};
        }
        super(sprite, x, y, velocity);
        this.xPeriod = x_period; //milliseconds
        this.yPeriod = y_period; //milliseconds

    }

    update(timestamp) {

        var yPhase = timestamp % this.yPeriod;
        var xPhase = timestamp % this.xPeriod;

        var xOffset = (this.boundsRect.width / this.xPeriod) * xPhase;

        var frequency = 1;
        var angle = yPhase / this.yPeriod * frequency * Math.PI * 2;
        var amplitude = this.boundsRect.height;
        var yOffset = Math.sin(angle) * amplitude;

        this.coords.x = this.boundsRect.left + xOffset;
        this.coords.y = this.boundsRect.top + yOffset;
    }

    die() {
        SoundManager.playSoundWithIdAndTime("explosion", 0);
        super.die();
    }
}

export default BouncingObject;
