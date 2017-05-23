/*
 * @author ohmed
 * Player manager sys
*/

var PlayerManager = function ( arena, params ) {

    this.arena = arena;
    this.players = [];

};

PlayerManager.prototype = {};

PlayerManager.prototype.init = function () {

    // todo

};

PlayerManager.prototype.add = function ( player ) {

    var team = this.arena.teamManager.getWeakest();
    team.addPlayer( player );
    this.players.push( player );

};

PlayerManager.prototype.remove = function ( player ) {

    var newPlayersList = [];
    var removed = true;

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === player.id ) {

            this.arena.collisionManager.removePlayer( player );
            removed = true;
            continue;

        }

        newPlayersList.push( this.players[ i ] );

    }

    this.players = newPlayersList;

    return removed;

};

PlayerManager.prototype.getById = function ( playerId ) {

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === playerId ) {

            return this.players[ i ];

        }

    }

    return false;

};

PlayerManager.prototype.update = function ( delta, time ) {

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        this.players[ i ].update( delta, time );

    }

};

PlayerManager.prototype.toJSON = function () {

    var players = [];

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        players.push( this.players[ i ].toPublicJSON() );

    }

    return players;

};

//

module.exports = PlayerManager;
