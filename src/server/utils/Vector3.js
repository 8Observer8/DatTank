/*
 * @author ohmed
 * Vector3 object
*/

var Vec3 = function ( x, y, z ) {

    this.x = x;
    this.y = y;
    this.z = z;

};

Vec3.prototype = {};

Vec3.prototype.set = function ( x, y, z ) {

    this.x = x;
    this.y = y;
    this.z = z;

};

//

module.exports = Vec3;
