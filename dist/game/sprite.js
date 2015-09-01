/**
 * Created by andrew on 3/28/15.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = (function () {
    function Sprite(id, image, width, height, sourceX, sourceY) {
        _classCallCheck(this, Sprite);

        this.id = id;
        this.image = image;
        this.sourceX = sourceX || 0;
        this.sourceY = sourceY || 0;

        this.width = image ? image.width : width || 10;
        this.height = image ? image.height : height || 10;
        this.x = 0;
        this.y = 0;

        this.centerXOffset = -83; // default offset
        this.centerYOffset = -100; // default offset
        this.scale = 1.0; // default image scale
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;
        this.scaledXOffset = this.centerXOffset * this.scale;
        this.scaledYOffset = this.centerYOffset * this.scale;
    }

    _createClass(Sprite, [{
        key: "setCenterOffse",

        /*
        duplicate(){
            return new Sprite(this.image, this.width, this.height, this.sourceX, this.sourceY);
        }
        */

        value: function setCenterOffse(x_offset, y_offset) {
            this.centerXOffset = x_offset;
            this.centerYOffset = y_offset;
            this.scaledXOffset = this.centerXOffset * this.scale;
            this.scaledYOffset = this.centerYOffset * this.scale;
        }
    }, {
        key: "draw",
        value: function draw(context) {

            if (this.image) {
                context.drawImage(this.image, this.sourceX, this.sourceY, this.width, this.height, this.x, this.y, this.width, this.height);
            } else {
                this.fill(context);
            }
        }
    }, {
        key: "fill",
        value: function fill(context) {
            context.fillStyle = "#999999";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }, {
        key: "load",
        value: function load(url, callback) {
            var img = new Image();
            var this_sprite = this;

            img.onload = function () {
                this_sprite.image = img;
                this_sprite.width = img.width;
                this_sprite.height = img.height;

                if (callback) {
                    callback(this_sprite);
                }
            };

            img.src = url;
        }
    }]);

    return Sprite;
})();

exports["default"] = Sprite;
module.exports = exports["default"];
//# sourceMappingURL=../game/sprite.js.map