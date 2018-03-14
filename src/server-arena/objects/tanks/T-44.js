/*
 * @author ohmed
 * Tank "T44" unit class
*/

var T44 = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'T44';

    this.speed = 51;
    this.armour = 90;
    this.bullet = 85;
    this.ammoCapacity = 64;
    this.rpm = 10.7;

    this.typeId = 2;

};

T44.prototype = Object.create( Game.Tank.prototype );

//

module.exports = T44;
