
var D32 = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'D-32';

    this.speed = 50;
    this.range = 160;
    this.armour = 150;
    this.bullet = 77;
    this.maxShells = 60;
    this.reloadTime = 300;

};

D32.prototype = Object.create( Game.Tank.prototype );

module.exports = D32;