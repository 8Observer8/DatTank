/*
 * @author ohmed
 * DatTank Networking
*/

var WebSocketServer = require('ws').Server;

var Network = {};

Network.init = function () {

    var scope = this;

    this.io = new WebSocketServer({ port: SOCKET_PORT });

    console.log( '> Socket network started on port ' + SOCKET_PORT );

    //

    this.io.on( 'connection', function ( socket ) {

        socket.on( 'message', function ( data ) {

            if ( typeof data === 'string' ) {

                data = JSON.parse( data );

                switch ( data.event ) {

                    case 'joinArena':

                        DT.ArenaManager.findArena( function ( arena ) {

                            var player = new DT.Player({ login: data.login, tank: data.tank });
                            player.socket = socket;

                            arena.addPlayer( player );

                            //

                            socket.arena = arena;
                            socket.player = player;

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

                switch ( event ) {

                    case 1:     // rotateTop

                        if ( ! socket.arena || ! socket.player ) return;
                        var angle = data[ 0 ] / 10;
                        socket.player.rotateTop( angle );
                        break;

                    case 2:     // move

                        if ( ! socket.arena || ! socket.player ) return;
                        socket.player.moveByPath( data );
                        break;

                    case 3:     // shoot

                        if ( ! socket.arena || ! socket.player ) return;
                        socket.player.shoot();
                        break;

                    case 4:     // hit

                        if ( ! socket.arena || ! socket.player ) return;

                        var target;
                        var shooter;

                        if ( data[2] < 10000 ) {

                            shooter = socket.arena.getPlayerById( data[ 2 ] );

                        } else {

                            shooter = socket.arena.getTowerById( data[ 2 ] - 10000 );

                        }

                        if ( data[0] >= 10000 ) {

                            target = socket.arena.getTowerById( data[ 0 ] - 10000 );

                        } else {

                            target = socket.arena.getPlayerById( data[ 0 ] );

                        }

                        var shootId = data[ 1 ];

                        if ( ! target || ! shooter ) return;

                        // target.hits[ shootId ] = 1;//( target.hits[ shootId ] || 0 ) + 1;

                        // if ( socket.arena.players.length - socket.arena.bots.length <= 3 * target.hits[ shootId ] ) {

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

                        if ( ! socket.arena || ! socket.player ) return;
                        socket.player.respawn();
                        break;

                    case 7:     // move bot

                        if ( ! socket.arena ) return;
                        var player = socket.arena.getPlayerById( data[ 0 ] );

                        if ( ! player ) return;

                        data = new Uint16Array( ab, 4 );
                        player.moveByPath( data );
                        break;

                    case 100: // 'PlayerTankRotateBase'

                        if ( ! socket.arena || ! socket.player ) return;

                        var player = socket.player;
                        var direction = data[ 0 ];

                        player.rotateBase( direction );

                        break;

                    case 101: // 'PlayerTankMove'

                        if ( ! socket.arena || ! socket.player ) return;

                        var player = socket.player;
                        var direction = data[ 0 ];

                        player.move( direction );

                        break;

                    case 102: // 'PlayerTankMoveToPoint'

                        if ( ! socket.arena || ! socket.player ) return;

                        var player = socket.player;
                        var destination = { x: data[ 0 ], y: 0, z: data[1] };

                        player.moveToPoint( destination );

                        break;

                    default:

                        // nothing here
                        break;

                }

            }

        });

        socket.on( 'error', function ( error ) {

            console.log( error );

        });

        //

        socket.on( 'close', function () {

            if ( socket.arena && socket.player ) {

                socket.player.socket = 'disconnected';

                setTimeout( function () {

                    socket.arena.removePlayer( socket.player );

                }, 4000 );

            }

        });

    });

};

Network.send = function ( socket, event, data ) {

    var bin = true;

    if ( data instanceof ArrayBuffer ) {

        bin = true;

    } else {

        bin = false;
        data.event = event;
        data = JSON.stringify( { 'event': event, 'data': data } );

    }

    if ( socket ) {

        try {

            socket.send( data, { binary: bin } );

        } catch ( e ) {

            console.warn( e );

        }

    }

};

Network.announce = function ( arena, event, data, view ) {

    var bin = false;

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

        data.event = event;
        data = JSON.stringify( { 'event': event, 'data': data } );

    }

    //

    for ( var i = 0, il = arena.players.length; i < il; i ++ ) {

        if ( arena.players[ i ].socket && arena.players[ i ].socket.readyState === 1 ) {

            arena.players[ i ].socket.send( data, { binary: bin } );

        }

    }

};

Network.broadcast = function ( socket, arena, event, data, view ) {

    var bin = false;

    if ( data instanceof ArrayBuffer ) {

        bin = true;

        switch ( event ) {

            case 'move':

                view[0] = 2;
                break;

            case 'shoot':

                view[0] = 3;
                break;

            default:

                // nothing here
                break;

        }

        data = new Buffer( data );

    } else {

        data.event = event;
        data = JSON.stringify( { 'event': event, 'data': data } );

    }

    //

    for ( var i = 0, il = arena.players.length; i < il; i ++ ) {

        if ( arena.players[ i ].socket && arena.players[ i ].socket !== socket && arena.players[ i ].socket.readyState === 1 ) {

            arena.players[ i ].socket.send( data, { binary: bin } );

        }

    }

};

module.exports = Network;