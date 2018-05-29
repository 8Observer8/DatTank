/*
 * @author ohmed
 * HealthBox main class
*/

var Health = function ( arena, params ) {

    Game.Box.call( this, arena, params );

    this.boxType = 'Health';
    this.amount = 20;

    //

    this.init();

};

Health.prototype = Object.create( Game.Box.prototype );

Health.prototype.pickUp = function ( player ) {

    this.dispose();
    player.changeHealth( this.amount );

};

//

module.exports = Health;
