/*
 * @author ohmed
 * Tank "T54" unit class
*/

var T54 = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'T54';

    this.speed = 48;
    this.armour = 120;
    this.bullet = 100;
    this.ammoCapacity = 50;
    this.rpm = 7.06;

    this.typeId = 3;

};

T54.prototype = Object.create( Game.Tank.prototype );

//

module.exports = T54;
