/*
 * @author ohmed
 * Tank "USA-T54" unit class
*/

DT.Tank.USAT54 = function ( params ) {

    DT.Tank.call( this, params );

    //

    this.model = {
        top:    'Tank01_top.json',
        base:   'Tank01_base.json'
    };

    this.name = 'USA-T54';

};

DT.Tank.USAT54.prototype = Object.create( DT.Tank.prototype );

DT.Tank.USAT54.prototype.speed = 43;
DT.Tank.USAT54.prototype.range = 100;
DT.Tank.USAT54.prototype.armour = 180;
DT.Tank.USAT54.prototype.bullet = 105;

//

DT.Tank.list[ 'USAT54' ] = {
    title:      'USA-T54',
    speed:      DT.Tank.USAT54.prototype.speed,
    range:      DT.Tank.USAT54.prototype.range,
    armour:     DT.Tank.USAT54.prototype.armour,
    bullet:     DT.Tank.USAT54.prototype.bullet
};
