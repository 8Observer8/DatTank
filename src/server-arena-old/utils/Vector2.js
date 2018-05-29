/*
 * @author ohmed
 * Vector2 object
*/

var Vec2 = function ( x, y ) {

    this.x = x || 0;
    this.y = y || 0;

};

Vec2.prototype = {};

Vec2.prototype.set = function ( x, y ) {

    this.x = x;
    this.y = y;

};

Vec2.prototype.copy = function ( source ) {

    this.x = source.x;
    this.y = source.y;

};

Vec2.prototype.clone = function () {

    return new Vec3( this.x, this.y );

};

Vec2.prototype.toJSON = function () {

    return {
        x: this.x,
        y: this.y
    };

};

//

module.exports = Vec2;
