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

    // todo

};

PlayerManager.prototype.remove = function ( player ) {

    // todo

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
