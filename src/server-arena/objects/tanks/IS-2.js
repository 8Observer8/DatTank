/*
 * @author ohmed
 * Tank "IS2" unit class
*/

var IS2 = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'IS2';

    this.speed = 37;
    this.armour = 90;
    this.bullet = 122;
    this.ammoCapacity = 36;
    this.rpm = 4.88 * 10;

    this.typeId = 0;

};

IS2.prototype = Object.create( Game.Tank.prototype );

//

module.exports = IS2;
