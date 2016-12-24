/*
 * @author ohmed
 * DatTank Arena Manager system
*/

var ArenaManager = function () {

    this.arenas = [];

};

ArenaManager.prototype = {};

ArenaManager.prototype.addArena = function ( callback ) {

    var scope = this;

    var arena = new DT.Arena( function ( arena ) {

        scope.arenas.push( arena );
        callback( arena );

    });

    return arena;

};

ArenaManager.prototype.removeArena = function ( arena ) {

    if ( this.arenas.length === 1 ) return;

    var newArenaList = [];

    for ( var i = 0, il = this.arenas.length; i < il; i ++ ) {

        if ( this.arenas[ i ].id === arena.id ) continue;

        newArenaList.push( this.arenas[ i ] );

    }

    this.arenas = newArenaList;

};

ArenaManager.prototype.removeEmptyArenas = function () {

    var newArenaList = [];
    var arena = false;

    if ( this.arenas.length === 1 ) return;

    for ( var i = 0, il = this.arenas.length; i < il; i ++ ) {

        arena = this.arenas[ i ];

        if ( arena.players.length - arena.bots.length === 0 ) continue;

        newArenaList.push( arena );

    }

    this.arenas = newArenaList;

};

ArenaManager.prototype.findArena = function ( callback ) {

    var minArena = false;
    var avgArena = false;
    var arena = false;

    this.removeEmptyArenas();

    //

    for ( var i = 0, il = this.arenas.length; i < il; i ++ ) {

        arena = this.arenas[ i ];

        if ( arena.players.length < 16 && arena.players > 5 ) {

            avgArena = this.arenas[ i ];

        }

        if ( ( ! minArena && arena.players.length < 16 ) || ( minArena && arena.players.length < minArena.players.length ) ) {

            minArena = arena;

        }

    }

    if ( ! avgArena ) {

        if ( ! minArena ) {

            return this.addArena( function ( arena ) {

                callback( arena );

            });

        } else {

            arena = minArena;

        }

    } else {

        arena = avgArena;

    }

    return callback( arena );

};

ArenaManager.prototype.getArenaById = function ( arenaId ) {

    for ( var i = 0, il = this.arenas.length; i < il; i ++ ) {

        if ( this.arenas[ i ].id === arenaId ) {

            return this.arenas[ i ];

        }

    }

    return false;

};

//

module.exports = new ArenaManager();
