/**
 * Created by andrew on 4/7/15.
 */

import MovingObject from './movingObject';
import SoundManager from './soundManager';

class Enemy extends MovingObject {
    constructor(sprite, x, y, velocity) {
        super(sprite, x, y, velocity);
        this.friction = {x:0, y:0};
    }

    update() {
        super.update();
        if (!this.inBounds) {
            this.die();
        }
    }

    die() {
        SoundManager.playSoundWithIdAndTime("explosion", 0);
        super.die();
    }
}

export default Enemy;