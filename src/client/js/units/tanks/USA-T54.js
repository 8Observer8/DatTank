/*
 * @author ohmed
 * Tank "USA-T54" unit class
*/

DT.Tank.USAT54 = function ( params ) {

    DT.Tank.call( this, params );

    // todo

    this.name = 'USA-T54';

};

DT.Tank.USAT54.prototype = Object.create( DT.Tank.prototype );

DT.Tank.USAT54.prototype.harm = 150;
DT.Tank.USAT54.prototype.speed = 60;
DT.Tank.USAT54.prototype.deffence = 60;

//

DT.Tank.list[ 'USAT54' ] = {
    title:      'USA-T54',
    speed:      DT.Tank.USAT54.prototype.speed,
    harm:       DT.Tank.USAT54.prototype.harm,
    deffence:   DT.Tank.USAT54.prototype.deffence
};
