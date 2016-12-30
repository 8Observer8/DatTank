/*
 * @author ohmed
 * AmmoBox main class
*/

var Ammo = function ( params ) {

    Game.Box.call( this, params );

    this.type = 'Ammo';
    this.amount = 40;

    //

    this.init();

};

Ammo.prototype = Object.create( Game.Box.prototype );

Ammo.prototype.pickUp = function ( player ) {

    player.ammo += this.amount;
    player.ammo = Math.min( player.tank.maxShells, player.ammo );

    //

    Game.Network.announce( this.arena, 'pickedBox', { id: this.id } );

    if ( player.socket ) {

        Game.Network.send( player.socket, 'gotBox', { box: this.toJSON(), value: player.ammo } );

    }

};

//

module.exports = Ammo;
