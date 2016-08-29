/*
 * @author ohmed
 * Tank "USA-T54" unit class
*/

DT.Tank.UKBlackPrince = function ( params ) {

    DT.Tank.call( this, params );

    // todo

    this.name = 'UK-Black-Prince';

};

DT.Tank.UKBlackPrince.prototype = Object.create( DT.Tank.prototype );

DT.Tank.UKBlackPrince.prototype.harm = 100;
DT.Tank.UKBlackPrince.prototype.speed = 100;
DT.Tank.UKBlackPrince.prototype.deffence = 100;

//

DT.Tank.list[ 'UKBlackPrince' ] = {
    title:      'UK-Black-Prince',
    speed:      DT.Tank.UKBlackPrince.prototype.speed,
    harm:       DT.Tank.UKBlackPrince.prototype.harm,
    deffence:   DT.Tank.UKBlackPrince.prototype.deffence
};
