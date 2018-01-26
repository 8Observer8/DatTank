/*
 * @author ohmed
 * Arena bullet object
*/

var Bullet = function ( id ) {

    this.id = false;
    this.ownerId = this.id;

    this.active = false;
    this.origPosition = { x: 0, y: 25, z: 0 };
    this.position = { x: 0, y: 25, z: 0 };
    this.angle = false;
    this.flytime = 5;

};

Bullet.prototype = {};

//

module.exports = Bullet;
