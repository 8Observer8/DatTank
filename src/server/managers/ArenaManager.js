/*
 * @author ohmed
 * DatTank Arena Manager system
*/

var ArenaManager = function () {

    this.arenas = [];

};

ArenaManager.prototype = {};

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

        if ( ! arena || ! arena.players ) continue;
        if ( arena.players.length - arena.bots.length === 0 ) continue;

        newArenaList.push( arena );

    }

    this.arenas = newArenaList;

};

ArenaManager.prototype.findArena = function ( callback ) {

    var minArena = false;
    var avgArena = false;
    var arena = false;
    var players = false;

    this.removeEmptyArenas();

    //

    for ( var i = 0, il = this.arenas.length; i < il; i ++ ) {

        arena = this.arenas[ i ];
        players = arena.playerManager.players;

        if ( players.length < 16 && players > 5 ) {

            avgArena = this.arenas[ i ];

        }

        if ( ( ! minArena && players.length < 16 ) || ( minArena && players.length < minArena.players.length ) ) {

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

ArenaManager.prototype.proxyEventToPlayer = function ( data, socket, eventName ) {

    if ( ! socket || ! socket.player ) return;

    socket.player.dispatchEvent({ type: eventName, data: data });

};

ArenaManager.prototype.proxyEventToArena = function ( data, socket, eventName ) {

    if ( ! socket || ! socket.arena ) return;

    socket.arena.dispatchEvent({ type: eventName, data: data });

};

ArenaManager.prototype.addNetworkListeners = function () {

    var scope = this;

    // New player whants to JOIN to some arena

    networkManager.addMessageListener( 'ArenaJoinRequest', function ( data, socket ) {

        scope.findArena( function ( arena ) {

            var player = arena.addPlayer({ login: data.login, tank: data.tank, socket: socket });

            var response = arena.toJSON();
            response.me = player.toPrivateJSON();

            networkManager.send( 'ArenaJoinResponce', socket, false, response );

        });

    });

    //

    networkManager.addMessageListener( 'ArenaPlayerRespawn', this.proxyEventToPlayer.bind( this ) );
    networkManager.addMessageListener( 'PlayerTankRotateTop', this.proxyEventToPlayer.bind( this ) );
    networkManager.addMessageListener( 'PlayerTankMove', this.proxyEventToPlayer.bind( this ) );
    networkManager.addMessageListener( 'PlayerTankMoveByPath', this.proxyEventToPlayer.bind( this ) );
    networkManager.addMessageListener( 'PlayerTankShoot', this.proxyEventToPlayer.bind( this ) );
    networkManager.addMessageListener( 'SendChatMessage', this.proxyEventToPlayer.bind( this ) );

    networkManager.addMessageListener( 'PlayerTankHit', function ( data, socket ) {

        if ( ! socket.arena ) return;
        var player = socket.arena.playerManager.getById( data[0] );
        if ( ! player ) return;

        player.dispatchEvent({ type: 'PlayerTankHit', data: data });

    });

    networkManager.addMessageListener( 'TowerHit', function ( data, socket ) {

        if ( ! socket.arena ) return;
        var tower = socket.arena.towerManager.getById( data[0] );
        if ( ! tower ) return;

        tower.dispatchEvent({ type: 'TowerHit', data: data });

    });

};

//

module.exports = new ArenaManager();
