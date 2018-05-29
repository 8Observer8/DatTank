/*
 * @author ohmed
 * Vector3 object
*/

var Vec3 = function ( x, y, z ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

};

Vec3.prototype = {};

Vec3.prototype.set = function ( x, y, z ) {

    this.x = x;
    this.y = y;
    this.z = z;

};

Vec3.prototype.copy = function ( source ) {

    this.x = source.x;
    this.y = source.y;
    this.z = source.z;

};

Vec3.prototype.clone = function () {

    return new Vec3( this.x, this.y, this.z );

};

Vec3.prototype.toJSON = function () {

    return {
        x: this.x,
        y: this.y,
        z: this.z
    };

};

//

module.exports = Vec3;
