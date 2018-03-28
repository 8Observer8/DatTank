/*
 * @author ohmed
 * DatTank Arena Manager system
*/

var ArenaManager = function () {

    this.arenas = [];
    this.maxPlayersInArena = 24;

};

ArenaManager.prototype = {};

//

ArenaManager.prototype.init = function () {

    this.addNetworkListeners();

};

ArenaManager.prototype.addArena = function ( callback ) {

    var scope = this;

    var arena = new Game.Arena( function ( arena ) {

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

        if ( ! arena || ! arena.playerManager.players ) continue;
        if ( arena.playerManager.players.length - arena.botManager.bots.length === 0 ) {

            arena.clear();
            continue;

        }

        newArenaList.push( arena );

    }

    this.arenas = newArenaList;

};

ArenaManager.prototype.findArena = function ( callback ) {

    var minArena = false;
    var avgArena = false;
    var arena = false;
    var players = false;
    var bots = false;
    var livePlayers = false;

    this.removeEmptyArenas();

    //

    for ( var i = 0, il = this.arenas.length; i < il; i ++ ) {

        arena = this.arenas[ i ];
        players = arena.playerManager.players;
        bots = arena.botManager.bots;
        livePlayers = players.length - bots.length;

        if ( livePlayers < this.maxPlayersInArena && players > 5 ) {

            avgArena = this.arenas[ i ];

        }

        if ( ( ! minArena && livePlayers < this.maxPlayersInArena ) || ( minArena && livePlayers < minArena.playerManager.players.length - minArena.botManager.bots.length ) ) {

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

ArenaManager.prototype.playerJoin = function ( data, socket ) {

    this.findArena( function ( arena ) {

        var player = arena.addPlayer({ login: data.login, tank: data.tank, socket: socket });

        var response = arena.toJSON();
        response.me = player.toPrivateJSON();

        networkManager.send( 'ArenaJoinResponse', socket, false, response );

    });

};

ArenaManager.prototype.proxyEventToPlayer = function ( data, socket, eventName ) {

    if ( ! socket || ! socket.player ) return;

    socket.player.dispatchEvent({ type: eventName, data: data });

};

ArenaManager.prototype.proxyEventToArena = function ( data, socket, eventName ) {

    if ( ! socket || ! socket.arena ) return;

    socket.arena.dispatchEvent({ type: eventName, data: data });

};

ArenaManager.prototype.addNetworkListeners = function () {

    networkManager.addMessageListener( 'ArenaJoinRequest', this.playerJoin.bind( this ) );
    networkManager.addMessageListener( 'ArenaPlayerRespawn', this.proxyEventToPlayer.bind( this ) );
    networkManager.addMessageListener( 'PlayerTankRotateTop', this.proxyEventToPlayer.bind( this ) );
    networkManager.addMessageListener( 'PlayerTankMove', this.proxyEventToPlayer.bind( this ) );
    networkManager.addMessageListener( 'PlayerTankShoot', this.proxyEventToPlayer.bind( this ) );
    networkManager.addMessageListener( 'PlayerTankUpdateStats', this.proxyEventToPlayer.bind( this ) );

};

//

module.exports = new ArenaManager();
