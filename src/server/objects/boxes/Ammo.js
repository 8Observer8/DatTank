/*
 * @author ohmed
 * AmmoBox main class
*/

var Ammo = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'AmmoBox';
    this.amount = 20;

};

Ammo.prototype = Object.create( DT.Box.prototype );

//

module.exports = Ammo;
