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

    var team = this.arena.teamManager.detectWeakest();
    team.addPlayer( player );
    this.players.push( player );

};

PlayerManager.prototype.remove = function ( player ) {

    var newPlayersList = [];
    var removed = true;

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === player.id ) {

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

//

module.exports = PlayerManager;
