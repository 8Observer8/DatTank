/*
 * @author ohmed
 * Tank "T54" unit class
*/

var T54 = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'T54';

    this.speed = 30;
    this.range = 160;
    this.armour = 700;
    this.bullet = 77;
    this.maxShells = 70;
    this.reloadTime = 1200;

    this.typeId = 2;

};

T54.prototype = Object.create( Game.Tank.prototype );

//

module.exports = T54;
