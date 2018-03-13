/*
 * @author ohmed
 * Tank "T44" unit class
*/

var T44 = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'T44';

    this.speed = 43;
    this.range = 100;
    this.armour = 360;
    this.bullet = 155;
    this.maxShells = 80;
    this.reloadTime = 700;

    this.typeId = 3;

};

T44.prototype = Object.create( Game.Tank.prototype );

//

module.exports = T44;
