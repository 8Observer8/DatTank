/*
 * @author ohmed
 * AmmoBox main class
*/

var Ammo = function ( arena, params ) {

    Game.Box.call( this, arena, params );

    this.type = 'Ammo';
    this.amount = 40;

    //

    this.init();

};

Ammo.prototype = Object.create( Game.Box.prototype );

Ammo.prototype.pickUp = function ( player ) {

    this.dispose();
    player.changeAmmo( this.amount );

};

//

module.exports = Ammo;
