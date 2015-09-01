/**
 * Created by andrew on 4/14/15.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rect = (function () {
    function Rect(obj) {
        _classCallCheck(this, Rect);

        this.top = obj.top;
        this.left = obj.left;
        this.width = obj.width;
        this.height = obj.height;
    }

    _createClass(Rect, [{
        key: "inBounds",
        value: function inBounds(point) {
            return point.x >= this.left && point.x <= this.right && point.y >= this.top && point.y <= this.bottom;
        }
    }, {
        key: "right",
        get: function get() {
            return this.left + this.width;
        }
    }, {
        key: "bottom",
        get: function get() {
            return this.top + this.height;
        }
    }]);

    return Rect;
})();

exports["default"] = Rect;
module.exports = exports["default"];
//# sourceMappingURL=../game/rect.js.map