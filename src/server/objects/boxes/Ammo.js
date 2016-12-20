/*
 * @author ohmed
 * AmmoBox main class
*/

var Ammo = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'Ammo';
    this.amount = 40;

    //

    this.init();

};

Ammo.prototype = Object.create( DT.Box.prototype );

Ammo.prototype.pickUp = function ( player ) {

    player.ammo += this.amount;
    player.ammo = Math.min( player.tank.maxShells, player.ammo );

    //

    DT.Network.announce( this.arena, 'pickedBox', { id: this.id } );

    if ( player.socket ) {

        DT.Network.send( player.socket, 'gotBox', { box: this.toPublicJSON(), value: player.ammo } );

    }

};

//

module.exports = Ammo;
