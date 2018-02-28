
var D32 = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'D-32';

    this.speed = 50;
    this.range = 160;
    this.armour = 300;
    this.bullet = 67;
    this.maxShells = 70;
    this.reloadTime = 300;

    this.typeId = 1;

};

D32.prototype = Object.create( Game.Tank.prototype );

module.exports = D32;