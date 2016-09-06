/*
 * @author ohmed
 * AmmoBox main class
*/

var Ammo = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'Ammo';
    this.amount = 20;

    //

    this.init();

};

Ammo.prototype = Object.create( DT.Box.prototype );

//

module.exports = Ammo;
