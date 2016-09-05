/*
 * @author ohmed
 * AmmoBox main class
*/

DT.Box.Ammo = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'AmmoBox';
    this.amount = 20;

};

DT.Box.Ammo.prototype = Object.create( DT.Box.prototype );
