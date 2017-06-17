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
    this.registerEvent( 'ArenaPlayerJoined', 'out', 'json', 2 );
    this.registerEvent( 'ArenaPlayerRespawn', 'out', 'json', 3 );
    this.registerEvent( 'ArenaPlayerRespawn', 'in', 'json', 4 );
    this.registerEvent( 'ArenaAddBox', 'out', 'json', 5 );
    this.registerEvent( 'ArenaPlayerLeft', 'out', 'json', 6 );

    this.registerEvent( 'PlayerTankRotateTop', 'out', 'bin', 100 );
    this.registerEvent( 'PlayerTankRotateTop', 'in', 'bin', 101 );

    this.registerEvent( 'PlayerTankMove', 'out', 'bin', 111 );
    this.registerEvent( 'PlayerTankMove', 'in', 'bin', 112 );

    this.registerEvent( 'PlayerTankMoveByPath', 'out', 'bin', 113 );
    this.registerEvent( 'PlayerTankMoveByPath', 'in', 'bin', 114 );

    this.registerEvent( 'PlayerTankShoot', 'out', 'bin', 115 );
    this.registerEvent( 'PlayerTankShoot', 'in', 'bin', 116 );

    this.registerEvent( 'PlayerTankHit', 'out', 'bin', 117 );
    this.registerEvent( 'PlayerTankHit', 'in', 'bin', 118 );

    this.registerEvent( 'PlayerTankDied', 'out', 'bin', 119 );
    this.registerEvent( 'PlayerGotBox', 'out', 'json', 120 );

    this.registerEvent( 'TowerRotateTop', 'out', 'bin', 200 );
    this.registerEvent( 'TowerShoot', 'out', 'bin', 201 );
    this.registerEvent( 'TowerChangeTeam', 'out', 'bin', 202 );

    this.registerEvent( 'TowerHit', 'out', 'bin', 203 );
    this.registerEvent( 'TowerHit', 'in', 'bin', 204 );
    this.registerEvent( 'BulletHit', 'out', 'json', 205 );

    this.registerEvent( 'RemoveBox', 'out', 'json', 301 );
    this.registerEvent( 'PickedBox', 'out', 'json', 302 );

    // register chat event

    this.registerEvent( 'SendChatMessage', 'out', 'json', 501 );
    this.registerEvent( 'SendChatMessage', 'in', 'json', 502 );

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

    if ( this.events.out[ eventName ].id === 500 ) x = 100 / a;

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
