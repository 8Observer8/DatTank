/*
 * @author ohmed
 * Tank "USA-T54" unit class
*/

DT.Tank.UKBlackPrince = function ( params ) {

    DT.Tank.call( this, params );

    //

    this.model = {
        top:    'Tank02_top.json',
        base:   'Tank02_base.json'
    };

    this.name = 'UK-Black-Prince';

};

DT.Tank.UKBlackPrince.prototype = Object.create( DT.Tank.prototype );

DT.Tank.UKBlackPrince.prototype.speed = 30;
DT.Tank.UKBlackPrince.prototype.range = 160;
DT.Tank.UKBlackPrince.prototype.armour = 252;
DT.Tank.UKBlackPrince.prototype.bullet = 77;

//

DT.Tank.list[ 'UKBlackPrince' ] = {
    title:      'UK-Black-Prince',
    speed:      DT.Tank.UKBlackPrince.prototype.speed,
    range:      DT.Tank.UKBlackPrince.prototype.range,
    armour:     DT.Tank.UKBlackPrince.prototype.armour,
    bullet:     DT.Tank.UKBlackPrince.prototype.bullet
};
