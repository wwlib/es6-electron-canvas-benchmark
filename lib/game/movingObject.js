/**
 * Created by andrew on 3/28/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _rect = require('./rect');

var _rect2 = _interopRequireDefault(_rect);

var MovingObject = (function () {
    function MovingObject(sprite, x, y) {
        var velocity = arguments[3] === undefined ? { x: 0, y: 0 } : arguments[3];

        _classCallCheck(this, MovingObject);

        this.sprite = sprite;
        this.coords = { x: x, y: y };
        this.width = this.sprite.width;
        this.height = this.sprite.width;
        this.ease = { x: 0, y: 0 };
        this.rotation = 0;
        this.velocity = { x: velocity.x, y: velocity.y };
        this.acceleration = { x: 0, y: 0 };
        this.friction = { x: 0, y: 0 };
        this.boundsRect = new _rect2['default']({ top: 0, left: 0, width: 0, height: 0 });
        this.alive = true;
    }

    _createClass(MovingObject, [{
        key: 'randomizeCoords',
        value: function randomizeCoords() {
            var x_range = this.boundsRect.width;
            this.coords.x = this.boundsRect.left + (x_range / 4 + Math.random() * x_range / 2);
            this.coords.y = this.boundsRect.top + 0;
        }
    }, {
        key: 'setRotation',
        value: function setRotation(degrees) {
            this.rotation = degrees;
        }
    }, {
        key: 'update',
        value: function update(elapsed) {
            var seconds = elapsed / 1000;
            this.velocity.x += this.acceleration.x * seconds;
            this.velocity.y += this.acceleration.y * seconds;
            this.velocity.x *= 1 - this.friction.x * seconds;
            this.velocity.y *= 1 - this.friction.y * seconds;
            this.coords.x += this.velocity.x * seconds;
            this.coords.y += this.velocity.y * seconds;
        }
    }, {
        key: 'draw',
        value: function draw(context) {

            this.sprite.x = this.coords.x + this.ease.x;
            this.sprite.y = this.coords.y + this.ease.y;

            this.sprite.draw(context);

            this.ease.x *= 0.9;
            this.ease.y *= 0.9;
        }
    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {

            this.ease.x = this.coords.x - x;
            this.ease.y = this.coords.y - y;
            this.coords.x = x;
            this.coords.y = y;
        }
    }, {
        key: 'die',
        value: function die() {
            //TODO SoundManager.play("explosion");

            this.alive = false;
        }
    }, {
        key: 'midpoint',
        get: function get() {
            var midpoint_x = this.coords.x; // + (this.width / 2);
            var midpoint_y = this.coords.y; // + (this.height / 2);
            return { x: midpoint_x, y: midpoint_y };
        }
    }, {
        key: 'bounds',
        set: function set(bounds_rect) {
            this.boundsRect = bounds_rect;
        },
        get: function get() {
            return this.boundsRect;
        }
    }, {
        key: 'inBounds',
        get: function get() {
            return this.boundsRect.inBounds(this.coords);
        }
    }]);

    return MovingObject;
})();

exports['default'] = MovingObject;
module.exports = exports['default'];
//# sourceMappingURL=../game/movingObject.js.map