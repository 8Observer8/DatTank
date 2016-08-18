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

ArenaManager.prototype.findArena = function () {

	var arena = false;

	for ( var i = 0, il = this.arenas.length; i < il; i ++ ) {

		if ( this.arenas[ i ].players.length < 15 ) {

			arena = this.arenas[ i ];
			break;

		}

	}

	if ( ! arena ) {

		arena = this.addArena();

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
