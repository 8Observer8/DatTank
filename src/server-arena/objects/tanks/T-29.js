/*
 * @author ohmed
 * Tank "T29" unit class
*/

var T29 = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'T29';

    this.speed = 50;
    this.range = 160;
    this.armour = 300;
    this.bullet = 67;
    this.maxShells = 70;
    this.reloadTime = 300;

    this.typeId = 1;

};

T29.prototype = Object.create( Game.Tank.prototype );

//

module.exports = T29;
