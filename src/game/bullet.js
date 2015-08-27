/**
 * Created by andrew on 4/7/15.
 */

import MovingObject from './movingObject';

class Bullet  extends MovingObject {
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
}

export default Bullet;