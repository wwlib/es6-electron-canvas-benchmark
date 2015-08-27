/**
 * Created by andrew on 4/14/15.
 */

class Rect {
    constructor(obj) {
        this.top = obj.top;
        this.left = obj.left;
        this.width = obj.width;
        this.height = obj.height;

    }

    get right() {
        return this.left + this.width;
    }

    get bottom() {
        return this.top + this.height;
    }

    inBounds(point) {
        return point.x >= this.left &&
            point.x <= this.right &&
            point.y >= this.top &&
            point.y <= this.bottom;
    }
}

export default Rect;
