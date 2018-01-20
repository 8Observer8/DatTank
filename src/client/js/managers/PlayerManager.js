/*
 * @author ohmed
 * Player manager sys
*/

Game.PlayerManager = function ( arena ) {

    this.arena = arena;
    this.players = [];

};

Game.PlayerManager.prototype = {};

Game.PlayerManager.prototype.init = function () {};

Game.PlayerManager.prototype.add = function ( player ) {

    if ( player.id === Game.arena.me ) {

        Game.arena.me = player;

    }

    this.players.push( player );

};

Game.PlayerManager.prototype.remove = function ( player ) {

    var newPlayersList = [];
    player = this.getById( player.id );

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === player.id ) continue;

        newPlayersList.push( this.players[ i ] );

    }

    player.tank.dispose();

    this.players = newPlayersList;

};

Game.PlayerManager.prototype.getById = function ( playerId ) {

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === playerId ) {

            return this.players[ i ];

        }

    }

    return false;

};
