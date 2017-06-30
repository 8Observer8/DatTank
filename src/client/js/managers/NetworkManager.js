/*
 * @author ohmed
 * DatTank networking
*/

Game.NetworkManager = function () {

    this.connected = false;
    this.transport = false;
    this.messageListeners = {};

    this.initCallback = false;

};

Game.NetworkManager.prototype = {};

Game.NetworkManager.prototype.init = function ( callback ) {

    if ( this.transport ) {

        console.error( '[NETWORK] Connection already established.' );
        return;

    }

    this.initCallback = callback;

    // register network events

    this.registerEvent( 'ArenaJoinRequest', 'out', 'json', 0 );
    this.registerEvent( 'ArenaJoinResponce', 'in', 'json', 1 );
    this.registerEvent( 'ArenaPlayerJoined', 'in', 'json', 2 );
    this.registerEvent( 'ArenaPlayerRespawn', 'in', 'json', 3 );
    this.registerEvent( 'ArenaPlayerRespawn', 'out', 'json', 4 );
    this.registerEvent( 'ArenaAddBox', 'in', 'json', 5 );
    this.registerEvent( 'ArenaPlayerLeft', 'in', 'json', 6 );

    //

    this.registerEvent( 'PlayersInRange', 'in', 'json', 50 );
    this.registerEvent( 'PlayersOutOfRange', 'in', 'json', 51 );
    this.registerEvent( 'TowersInRange', 'in', 'json', 60 );
    this.registerEvent( 'TowersOutOfRange', 'in', 'json', 61 );

    this.registerEvent( 'PlayerTankRotateTop', 'in', 'bin', 100 );
    this.registerEvent( 'PlayerTankRotateTop', 'out', 'bin', 101 );

    this.registerEvent( 'PlayerTankMove', 'in', 'bin', 111 );
    this.registerEvent( 'PlayerTankMove', 'out', 'bin', 112 );

    this.registerEvent( 'PlayerTankMoveByPath', 'in', 'bin', 113 );
    this.registerEvent( 'PlayerTankMoveByPath', 'out', 'bin', 114 );

    this.registerEvent( 'PlayerTankShoot', 'in', 'bin', 115 );
    this.registerEvent( 'PlayerTankShoot', 'out', 'bin', 116 );

    this.registerEvent( 'PlayerTankHit', 'in', 'bin', 117 );
    this.registerEvent( 'PlayerTankHit', 'out', 'bin', 118 );

    this.registerEvent( 'PlayerTankDied', 'in', 'bin', 119 );
    this.registerEvent( 'PlayerGotBox', 'in', 'json', 120 );

    //

    this.registerEvent( 'TowerRotateTop', 'in', 'bin', 200 );
    this.registerEvent( 'TowerShoot', 'in', 'bin', 201 );
    this.registerEvent( 'TowerChangeTeam', 'in', 'bin', 202 );

    this.registerEvent( 'TowerHit', 'in', 'bin', 203 );
    this.registerEvent( 'TowerHit', 'out', 'bin', 204 );
    this.registerEvent( 'BulletHit', 'in', 'json', 205 );

    //

    this.registerEvent( 'RemoveBox', 'out', 'json', 301 );
    this.registerEvent( 'PickedBox', 'in', 'json', 302 );

    // register chat event

    this.registerEvent( 'SendChatMessage', 'in', 'json', 501 );
    this.registerEvent( 'SendChatMessage', 'out', 'json', 502 );

    // establish connection

    this.transport = new WebSocket( 'ws://' + window.location.host.split(':')[0] + ':8085/ws/game' );
    this.transport.binaryType = 'arraybuffer';

    // add event handlers

    this.transport.addEventListener( 'open', this.onConnect.bind( this ) );
    this.transport.addEventListener( 'close', this.onDisconnected.bind( this ) );
    this.transport.addEventListener( 'error', this.onError.bind( this ) );
    this.transport.addEventListener( 'message', this.onMessage.bind( this ) );

};

Game.NetworkManager.prototype.onConnect = function () {

    this.connected = true;
    this.initCallback();

    //

    console.log( '[NETWORK] Connected to server.' );

};

Game.NetworkManager.prototype.onMessage = function ( event ) {

    var eventId = new Int16Array( event.data, 0, 1 )[ 0 ];
    var content = new Int16Array( event.data, 2 );

    this.triggerMessageListener( eventId, content );

};

Game.NetworkManager.prototype.onDisconnected = function () {

    this.connected = false;
    this.transport = false;

    this.init();

    //

    console.log( '[NETWORK] Connection closed.' );

};

Game.NetworkManager.prototype.onError = function ( err ) {

    // todo: handle error

    //

    console.error( '[NETWORK] Connection error: ', err );

};

Game.NetworkManager.prototype.send = function ( eventName, data, view ) {

    if ( ! this.transport ) {

        console.error( '[NETWORK:SEND_MESSAGE] No network socket connection.' );
        return false;

    }

    if ( ! this.events.out[ eventName ] ) {

        console.error( '[NETWORK:SEND_MESSAGE] No event "' + eventName + '" registered.' );
        return false;

    }

    if ( ! data ) {

        data = JSON.stringify( view );
        data = TextEncoder.encode( data );

        var newData = new Uint16Array( data.length + 1 );

        for ( var i = 0, il = data.length; i < il; i ++ ) {

            newData[ i + 1 ] = data[ i ];

        }

        data = newData;
        data[0] = this.events.out[ eventName ].id;

    } else {

        view[0] = this.events.out[ eventName ].id;

    }

    this.transport.send( data, { binary: true, mask: true } );

};

Game.NetworkManager.prototype.addMessageListener = function ( eventName, callback ) {

    this.messageListeners[ eventName ] = this.messageListeners[ eventName ] || [];
    this.messageListeners[ eventName ].push( callback );

};

Game.NetworkManager.prototype.triggerMessageListener = function ( eventId, data ) {

    if ( ! this.events.in[ eventId ] ) {

        console.warn( '[NETWORK] Event with ID:' + eventId + ' not found.' );
        return;

    }

    //

    var eventName = this.events.in[ eventId ].name;
    var eventType = this.events.in[ eventId ].dataType;
    var listeners = this.messageListeners[ eventName ] || [];
    var content;

    if ( eventType === 'json' ) {

        data = new Uint16Array( data, 2 );
        data = TextEncoder.decode( data );
        data = JSON.parse( data );

    } else {

        data = new Int16Array( data, 2 );

    }

    for ( var i = 0, il = listeners.length; i < il; i ++ ) {

        if ( listeners[ i ] ) {

            listeners[ i ]( data, eventName );

        }

    }

};

Game.NetworkManager.prototype.registerEvent = function ( eventName, ioType, dataType, eventId ) {

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

Game.NetworkManager.prototype.events = {
    in:     {},
    out:    {}
};
