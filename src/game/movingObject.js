/**
 * Created by andrew on 3/28/15.
 */

import Rect from './rect';

class MovingObject {

    constructor(sprite, x, y, velocity = {x: 0, y: 0}) {
        this.sprite = sprite;
        this.coords = {x: x, y: y};
        this.width = this.sprite.width;
        this.height = this.sprite.width;
        this.ease = {x: 0, y: 0};
        this.rotation = 0;
        this.velocity = {x: velocity.x, y: velocity.y};
        this.acceleration = {x: 0, y: 0};
        this.friction = {x:0, y:0};
        this.boundsRect = new Rect({top: 0, left: 0, width: 0, height: 0});
        this.alive = true;

    }

    get midpoint() {
        var midpoint_x = this.coords.x;// + (this.width / 2);
        var midpoint_y = this.coords.y;// + (this.height / 2);
        return {x:midpoint_x, y:midpoint_y};
    }

    set bounds(bounds_rect) {
        this.boundsRect = bounds_rect;
    }

    get bounds() {
        return this.boundsRect;
    }

    get inBounds() {
        return this.boundsRect.inBounds(this.coords);
    }

    randomizeCoords() {
        var x_range = this.boundsRect.width;
        this.coords.x = this.boundsRect.left + (x_range / 4 + Math.random() * x_range / 2);
        this.coords.y = this.boundsRect.top + 0;
    }

    setRotation(degrees) {
        this.rotation = degrees;
    }

    update(elapsed) {
        let seconds = elapsed / 1000;
        this.velocity.x += this.acceleration.x * seconds;
        this.velocity.y += this.acceleration.y * seconds;
        this.velocity.x *= (1 - this.friction.x * seconds);
        this.velocity.y *= (1 - this.friction.y * seconds);
        this.coords.x += this.velocity.x * seconds;
        this.coords.y += this.velocity.y * seconds;
    }

    draw(context) {

        this.sprite.x = this.coords.x + this.ease.x;
        this.sprite.y = this.coords.y + this.ease.y;

        this.sprite.draw(context);

        this.ease.x *= 0.9;
        this.ease.y *= 0.9;
    }

    moveTo(x, y) {

        this.ease.x = this.coords.x - x;
        this.ease.y = this.coords.y - y;
        this.coords.x = x;
        this.coords.y = y;
    }

    die() {
        //TODO SoundManager.play("explosion");

        this.alive = false;
    }
}

export default MovingObject;

