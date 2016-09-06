/*
 * @author ohmed
 * HealthBox main class
*/

var Health = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'Health';
    this.amount = 20;

    //

    this.init();

};

Health.prototype = Object.create( DT.Box.prototype );

Health.prototype.pickUp = function ( player ) {

	player.health += this.amount;
	player.health = Math.min( player.health, 100 );

	player.hit( false );

	//

    DT.Network.announce( this.arena.room, 'pickedBox', { id: this.id } );

    if ( player.socket ) {

        DT.Network.send( player.socket, 'gotBox', { box: this.toPublicJSON() } );

    }

};

//

module.exports = Health;
