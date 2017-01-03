/*
 * @author ohmed
 * DatTank Networking
*/

var WebSocketServer = require('ws').Server;

var NetworkManager = function () {

    this.io = false;

};

NetworkManager.prototype.init = function () {

    this.io = new WebSocketServer({ port: SOCKET_PORT });
    this.io.on( 'connection', this.onConnect.bind( this ) );

    //

    console.log( '> Socket network started on port ' + SOCKET_PORT );

};

NetworkManager.prototype.onConnect = function ( socket ) {

    socket.on( 'message', this.onMessage.bind( this, socket ) );
    socket.on( 'error', this.onError.bind( this, socket ) );
    socket.on( 'close', this.onDisconnect.bind( this, socket ) );

};

NetworkManager.prototype.onDisconnect = function ( socket ) {

    if ( socket.arena && socket.player ) {

        socket.player.socket = 'disconnected';

        setTimeout( function () {

            socket.arena.removePlayer( socket.player );

        }, 4000 );

    }

};

NetworkManager.prototype.onMessage = function ( socket, data ) {

    var scope = this;

    if ( typeof data === 'string' ) {

        data = JSON.parse( data );

        switch ( data.event ) {

            case 'joinArena':

                Game.ArenaManager.findArena( function ( arena ) {

                    var player = arena.addPlayer({ login: data.login, tank: data.tank, socket: socket });

                    var response = arena.toPublicJSON();
                    response.me = player.id;

                    scope.send( socket, 'joinArena', response );

                });

                break;

            default:

                // nothig here
                break;

        }

    } else {

        var ab = data.buffer.slice( data.byteOffset, data.byteOffset + data.byteLength );
        var event = new Uint16Array( ab, 0, 1 )[ 0 ];
        var data = new Int16Array( ab, 2 );

        var arena = socket.arena;
        var player = socket.player;

        switch ( event ) {

            case 1:     // rotateTop

                if ( ! arena || ! player ) return;
                var angle = data[ 0 ] / 10;
                player.rotateTop( angle );
                break;

            case 2:     // move

                if ( ! arena || ! player ) return;
                player.moveByPath( data );
                break;

            case 3:     // shoot

                if ( ! arena || ! player ) return;
                player.shoot();
                break;

            case 4:     // hit

                if ( ! arena || ! player ) return;

                var target;
                var shooter;

                if ( data[2] < 10000 ) {

                    shooter = arena.playerManager.getById( data[ 2 ] );

                } else {

                    shooter = arena.towerManager.getById( data[ 2 ] - 10000 );

                }

                if ( data[0] >= 10000 ) {

                    target = arena.towerManager.getById( data[ 0 ] - 10000 );

                } else {

                    target = arena.playerManager.getById( data[ 0 ] );

                }

                var shootId = data[ 1 ];

                if ( ! target || ! shooter ) return;

                // target.hits[ shootId ] = 1;//( target.hits[ shootId ] || 0 ) + 1;

                // if ( arena.players.length - arena.bots.length <= 3 * target.hits[ shootId ] ) {

                if ( target.hits[ shootId ] !== 1 ) {

                    target.hit( shooter );
                    target.hits[ shootId ] = 1;

                    setTimeout( function () {

                        delete target.hits[ shootId ];

                    }, 1000 );

                    // delete target.hits[ shootId ];

                }

                break;

            case 6:     // respawn

                if ( ! arena || ! player ) return;
                player.respawn();
                break;

            case 7:     // move bot

                if ( ! arena ) return;
                var player = arena.playerManager.getById( data[ 0 ] );

                if ( ! player ) return;

                data = new Uint16Array( ab, 4 );
                player.moveByPath( data );
                break;

            case 100: // 'PlayerTankRotateBase'

                if ( ! arena || ! player ) return;

                var direction = data[ 0 ];

                player.rotateBase( direction );

                break;

            case 101: // 'PlayerTankMove'

                if ( ! arena || ! player ) return;

                var direction = data[ 0 ];

                player.move( direction );

                break;

            case 102: // 'PlayerTankMoveToPoint'

                if ( ! arena || ! player ) return;

                var destination = { x: data[ 0 ], y: 0, z: data[1] };

                player.moveToPoint( destination );

                break;

            default:

                // nothing here
                break;

        }

    }

};

NetworkManager.prototype.onError = function ( socket, error ) {

    console.log( error );

};

NetworkManager.prototype.send = function ( socket, event, data, view ) {

    var bin = true;

    if ( data instanceof ArrayBuffer ) {

        bin = true;

        switch ( event ) {

            case 'rotateTop':

                view[0] = 1;
                break;

            case 'hit':

                view[0] = 4;
                break;

            case 'die':

                view[0] = 5;
                break;

            case 'shoot':

                view[0] = 3;
                break;

            case 'MoveTankByPath':

                view[0] = 100;
                break;

            case 'TowerRotateTop':

                view[0] = 200;
                break;

            case 'ShootTower':

                view[0] = 210;
                break;

            case 'TowerChangeTeam':

                view[0] = 400;
                break;

            default:

                // nothing here
                break;

        }

        data = new Buffer( data );

    } else {

        bin = false;
        data.event = event;
        data = JSON.stringify( { 'event': event, 'data': data } );

    }

    if ( socket ) {

        try {

            socket.send( data, { binary: bin } );

        } catch ( e ) {

            // console.warn( e );

        }

    }

};

module.exports = NetworkManager;
