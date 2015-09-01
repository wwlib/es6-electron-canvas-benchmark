/**
 * Created by andrew on 3/28/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _movingObject = require('./movingObject');

var _movingObject2 = _interopRequireDefault(_movingObject);

var _soundManager = require('./soundManager');

var _soundManager2 = _interopRequireDefault(_soundManager);

var BouncingObject = (function (_MovingObject) {
    function BouncingObject(sprite, x, y, velocity, x_period, y_period) {
        _classCallCheck(this, BouncingObject);

        if (!velocity) {
            velocity = { 'x': 1, 'y': 0 };
        }
        _get(Object.getPrototypeOf(BouncingObject.prototype), 'constructor', this).call(this, sprite, x, y, velocity);
        this.xPeriod = x_period; //milliseconds
        this.yPeriod = y_period; //milliseconds
    }

    _inherits(BouncingObject, _MovingObject);

    _createClass(BouncingObject, [{
        key: 'update',
        value: function update(timestamp) {

            var yPhase = timestamp % this.yPeriod;
            var xPhase = timestamp % this.xPeriod;

            var xOffset = this.boundsRect.width / this.xPeriod * xPhase;

            var frequency = 1;
            var angle = yPhase / this.yPeriod * frequency * Math.PI * 2;
            var amplitude = this.boundsRect.height;
            var yOffset = Math.sin(angle) * amplitude;

            this.coords.x = this.boundsRect.left + xOffset;
            this.coords.y = this.boundsRect.top + yOffset;
        }
    }, {
        key: 'die',
        value: function die() {
            _soundManager2['default'].playSoundWithIdAndTime('explosion', 0);
            _get(Object.getPrototypeOf(BouncingObject.prototype), 'die', this).call(this);
        }
    }]);

    return BouncingObject;
})(_movingObject2['default']);

exports['default'] = BouncingObject;
module.exports = exports['default'];
//# sourceMappingURL=../game/bouncingObject.js.map