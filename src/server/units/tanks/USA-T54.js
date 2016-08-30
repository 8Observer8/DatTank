/*
 * @author ohmed
 * Tank "USA-T54" unit class
*/

var USAT54 = function ( params ) {

    DT.Tank.call( this, params );

    this.title = 'USA-T54';

    this.speed = 43;
    this.range = 100;
    this.armour = 180;
    this.bullet = 105;

};

USAT54.prototype = Object.create( DT.Tank.prototype );

module.exports = USAT54;
