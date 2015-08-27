/**
 * Created by andrew on 3/28/15.
 */

import MovingObject from './movingObject';
import SoundManager from './soundManager';

class Player extends MovingObject {

    constructor(sprite, x, y) {

        super(sprite, x, y);
        this.friction = {x:0.1, y:0.1};

    }

    die() {
        SoundManager.playSoundWithIdAndTime("explosion", 0);
        super.die();
    }
}

export default Player;