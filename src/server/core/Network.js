/*
 * @author ohmed
 * DatTank Networking
*/

var Network = {};

Network.init = function () {

    var scope = this;

    console.log( '> Socket network started on port ' + SOCKET_PORT );

    io.on( 'connection', function ( socket ) {

        socket.on( 'message', function ( data ) {

            if ( typeof data === 'string' ) {

                data = JSON.parse( data );

                switch ( data.event ) {

                    case 'joinArena':

                        var arena = DT.ArenaManager.findArena();
                        var player = new DT.Player({ login: data.login });
                        player.socket = socket;

                        socket.join( 'arenaRoomId' + arena.id );

                        if ( ! arena.room ) {

                            arena.room = socket.room( 'arenaRoomId' + arena.id );
                            arena.reset( true );

                        }

                        arena.addPlayer( player );

                        //

                        socket.arena = arena;
                        socket.player = player;

                        var response = arena.toPublicJSON();
                        response.me = player.id;

                        scope.send( socket, 'joinArena', response );

                        break;

                    case 'reconnect':

                        var arena = DT.ArenaManager.getArenaById( data.arena );
                        if ( ! arena ) return;
                        var player = arena.getPlayerById( data.id );
                        if ( ! player ) return;
                        if ( player.afkTimeout ) clearTimeout( player.afkTimeout );
                        socket.join( 'arenaRoomId' + arena.id );
                        socket.arena = arena;
                        socket.player = player;
                        player.socket = socket;

                        break;

                    default:

                        // nothig here
                        break;

                }

            } else {

                var ab = data.buffer.slice( data.byteOffset, data.byteOffset + data.byteLength );
                var event = new Uint16Array( ab, 0, 1 )[ 0 ];
                var data = new Uint16Array( ab, 2 );

                switch ( event ) {

                    case 1:     // rotateTop

                        if ( ! socket.arena || ! socket.player ) return;
                        socket.player.rotateTop({ topAngle: data[ 0 ] / 100, baseAngle: data[ 1 ] / 100 });
                        break;

                    case 2:     // move

                        if ( ! socket.arena || ! socket.player ) return;
                        socket.player.move( data );
                        break;

                    case 3:     // shoot

                        if ( ! socket.arena || ! socket.player ) return;
                        socket.player.shoot();
                        break;

                    case 4:     // hit

                        if ( ! socket.arena || ! socket.player ) return;

                        var target = socket.arena.getPlayerById( data[ 0 ] );
                        var shooter = socket.arena.getPlayerById( data[ 2 ] );
                        var shootId = data[ 1 ];

                        if ( ! target || ! shooter ) return;

                        target.hits[ shootId ] = ( target.hits[ shootId ] || 0 ) + 1;

                        // if ( socket.arena.players.length - socket.arena.bots.length <= 3 * target.hits[ shootId ] ) {
                        if ( target.hits[ shootId ] === 1 ) {

                            target.hit( shooter );
                            delete target.hits[ shootId ];

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
                        player.move( data );
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

                // socket.arena.removePlayer( socket.player );
                socket.player.socket = 'disconnected';

            }

        });

    });

};

Network.send = function ( socket, event, data ) {

    if ( data instanceof ArrayBuffer ) {

    } else {

        data.event = event;
        data = JSON.stringify( { 'event': event, 'data': data } );

    }

    socket.send( data );

};

Network.announce = function ( room, event, data, view ) {

    if ( data instanceof ArrayBuffer ) {

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

            case 'moveBot':

                view[0] = 100;
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

    if ( ! room ) return;

    room.clients( function ( err, clients ) {

        for ( var i = 0, il = clients.length; i < il; i ++ ) {
        
            if ( io.clients[ clients[ i ] ] ) {

                io.clients[ clients[ i ] ].send( data );

            }

        }

    });

};

Network.broadcast = function ( socket, roomName, event, data, view ) {

    if ( data instanceof ArrayBuffer ) {

        switch ( event ) {

            case 'rotateTop':

                view[0] = 1;
                break;

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

    socket.room( roomName ).send( data );

};

module.exports = Network;
