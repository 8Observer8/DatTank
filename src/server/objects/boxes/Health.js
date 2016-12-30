/*
 * @author ohmed
 * HealthBox main class
*/

var Health = function ( params ) {

    Game.Box.call( this, params );

    this.type = 'Health';
    this.amount = 20;

    //

    this.init();

};

Health.prototype = Object.create( Game.Box.prototype );

Health.prototype.pickUp = function ( player ) {

    player.health += this.amount;
    player.health = Math.min( player.health, 100 );

    player.hit( false );

    //

    Game.Network.announce( this.arena, 'pickedBox', { id: this.id } );

    if ( player.socket ) {

        Game.Network.send( player.socket, 'gotBox', { box: this.toJSON(), value: player.health } );

    }

};

//

module.exports = Health;
