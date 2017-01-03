/*
 * @author ohmed
 * DatTank Networking
*/

var TextEncoder = require( './../utils/TextEncoder' );
var WebSocketServer = require('ws').Server;

var NetworkManager = function () {

    this.io = false;
    this.messageListeners = {};

};

NetworkManager.prototype.init = function () {

    // register events

    this.registerEvent( 'ArenaJoinRequest', 'in', 'json', 0 );
    this.registerEvent( 'ArenaJoinResponce', 'out', 'json', 1 );

    this.registerEvent( 'TankRotateTop', 'out', 'bin', 100 );
    this.registerEvent( 'TankRotateTop', 'in', 'bin', 101 );

    // enable io

    this.io = new WebSocketServer({ port: SOCKET_PORT });
    this.io.on( 'connection', this.onConnect.bind( this ) );

    //

    console.log( '> Socket network started on port ' + SOCKET_PORT );

};

NetworkManager.prototype.registerEvent = function ( eventName, ioType, dataType, eventId ) {

    if ( ! this.events[ ioType ] ) {

        console.error( 'Wrong event IO type.' );
        return;

    }

    if ( ioType === 'out' ) {

        this.events.out[ eventName ] = {
            id:         eventId,
            name:       eventName,
            dataType:   dataType
        };

    } else {

        this.events.in[ eventId ] = {
            id:         eventId,
            name:       eventName,
            dataType:   dataType
        };

    }

};

NetworkManager.prototype.addMessageListener = function ( eventName, callback ) {

    this.messageListeners[ eventName ] = this.messageListeners[ eventName ] || [];
    this.messageListeners[ eventName ].push( callback );

};

NetworkManager.prototype.triggerMessageListener = function ( eventId, data, socket ) {

    if ( ! this.events.in[ eventId ] ) {

        console.warn( '[NETWORK] Event with ID:' + eventId + ' not found.' );
        return;

    }

    //

    var eventName = this.events.in[ eventId ].name;
    var eventType = this.events.in[ eventId ].dataType;
    var listeners = this.messageListeners[ eventName ] || [];

    if ( eventType === 'json' ) {

        data = TextEncoder.decode( data );
        data = JSON.parse( data );

    }

    for ( var i = 0, il = listeners.length; i < il; i ++ ) {

        if ( listeners[ i ] ) {

            listeners[ i ]( data, socket, eventName );

        }

    }

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

    var arrayBuffer = data.buffer.slice( data.byteOffset, data.byteOffset + data.byteLength );
    var eventId = new Int16Array( arrayBuffer, 0, 1 )[ 0 ];
    var content = new Int16Array( arrayBuffer, 2 );

    this.triggerMessageListener( eventId, content, socket );

    //

    //     case 2:     // move

    //         if ( ! arena || ! player ) return;
    //         player.moveByPath( data );
    //         break;

    //     case 3:     // shoot

    //         if ( ! arena || ! player ) return;
    //         player.shoot();
    //         break;

    //     case 4:     // hit

    //         if ( ! arena || ! player ) return;

    //         var target;
    //         var shooter;

    //         if ( data[2] < 10000 ) {

    //             shooter = arena.playerManager.getById( data[ 2 ] );

    //         } else {

    //             shooter = arena.towerManager.getById( data[ 2 ] - 10000 );

    //         }

    //         if ( data[0] >= 10000 ) {

    //             target = arena.towerManager.getById( data[ 0 ] - 10000 );

    //         } else {

    //             target = arena.playerManager.getById( data[ 0 ] );

    //         }

    //         var shootId = data[ 1 ];

    //         if ( ! target || ! shooter ) return;

    //         // target.hits[ shootId ] = 1;//( target.hits[ shootId ] || 0 ) + 1;

    //         // if ( arena.players.length - arena.bots.length <= 3 * target.hits[ shootId ] ) {

    //         if ( target.hits[ shootId ] !== 1 ) {

    //             target.hit( shooter );
    //             target.hits[ shootId ] = 1;

    //             setTimeout( function () {

    //                 delete target.hits[ shootId ];

    //             }, 1000 );

    //             // delete target.hits[ shootId ];

    //         }

    //         break;

    //     case 6:     // respawn

    //         if ( ! arena || ! player ) return;
    //         player.respawn();
    //         break;

    //     case 7:     // move bot

    //         if ( ! arena ) return;
    //         var player = arena.playerManager.getById( data[ 0 ] );

    //         if ( ! player ) return;

    //         data = new Uint16Array( ab, 4 );
    //         player.moveByPath( data );
    //         break;

    //     case 100: // 'PlayerTankRotateBase'

    //         if ( ! arena || ! player ) return;

    //         var direction = data[ 0 ];

    //         player.rotateBase( direction );

    //         break;

    //     case 101: // 'PlayerTankMove'

    //         if ( ! arena || ! player ) return;

    //         var direction = data[ 0 ];

    //         player.move( direction );

    //         break;

    //     case 102: // 'PlayerTankMoveToPoint'

    //         if ( ! arena || ! player ) return;

    //         var destination = { x: data[ 0 ], y: 0, z: data[1] };

    //         player.moveToPoint( destination );

    //         break;

};

NetworkManager.prototype.onError = function ( socket, error ) {

    console.log( error );

};

NetworkManager.prototype.send = function ( eventName, socket, data, view ) {

    if ( ! socket || socket.readyState !== 1 ) return;

    if ( ! this.events.out[ eventName ] ) {

        console.error( '[NETWORK:SEND_MESSAGE] No event "' + eventName + '" registered.' );
        return false;

    }

    if ( ! data ) {

        data = JSON.stringify( view );
        data = TextEncoder.encode( data );

        var newData = new Int16Array( data.length + 1 );

        for ( var i = 0, il = data.length; i < il; i ++ ) {

            newData[ i + 1 ] = data[ i ];

        }

        data = newData;
        data[0] = this.events.out[ eventName ].id;

    } else {

        view[0] = this.events.out[ eventName ].id;

    }

    socket.send( data, { binary: true } );

};

NetworkManager.prototype.events = {
    in:     {},
    out:    {}
};

module.exports = NetworkManager;
