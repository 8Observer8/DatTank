/*
 * @author ohmed
 * DatTank Arena Manager system
*/

var ArenaManager = function () {

    this.arenas = [];

};

ArenaManager.prototype = {};

ArenaManager.prototype.addArena = function () {

    var arena = new DT.Arena();

    this.arenas.push( arena );

    return arena;

};

ArenaManager.prototype.removeArena = function ( arena ) {

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

    for ( var i = 0, il = this.arenas.length; i < il; i ++ ) {

        arena = this.arenas[ i ];

        if ( arena.players.length - arena.bots.length === 0 ) continue;

        newArenaList.push( arena );

    }

    this.arenas = newArenaList;

};

ArenaManager.prototype.findArena = function () {

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

            arena = this.addArena();

        } else {

            arena = minArena;

        }

    } else {

        arena = avgArena;

    }

    return arena;

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
