/*
 * @author ohmed
 * Tank "UK-BlackPrince" unit class
*/

var UKBlackPrince = function ( params ) {

    Game.Tank.call( this, params );

    this.title = 'UK-BlackPrince';

    this.speed = 30;
    this.range = 160;
    this.armour = 252;
    this.bullet = 77;
    this.maxShells = 60;
    this.reloadTime = 40;

};

UKBlackPrince.prototype = Object.create( Game.Tank.prototype );

module.exports = UKBlackPrince;
