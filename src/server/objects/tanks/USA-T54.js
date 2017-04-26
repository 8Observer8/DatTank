/*
 * @author ohmed
 * Tank "USA-T54" unit class
*/

var USAT54 = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'USA-T54';

    this.speed = 43;
    this.range = 100;
    this.armour = 180;
    this.bullet = 155;
    this.maxShells = 70;
    this.reloadTime = 700;

};

USAT54.prototype = Object.create( Game.Tank.prototype );

module.exports = USAT54;
