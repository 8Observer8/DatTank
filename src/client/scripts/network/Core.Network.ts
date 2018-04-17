/*
 * @author ohmed
 * DatTank Network
*/

import { TextEncoder } from "./../utils/TextEncoder";

//

enum EventDir { IN = 'in', OUT = 'out' };
enum EventType { BIN = 0, JSON = 1 };

//

class NetworkCore {

    private static instance: NetworkCore;

    private transport;
    private messageListeners: object = {};
    private initCallback;

    private host: string = window.location.hostname;

    private events = {
        in:     {},
        out:    {}
    };

    //

    public init ( callback ) {

        if ( this.transport ) {

            console.error( '[NETWORK] Connection already established.' );
            return;

        }

        this.initCallback = callback;

        // register network events

        this.registerEvent( 'ArenaJoinRequest', EventDir.OUT, EventType.JSON, 0 );
        this.registerEvent( 'ArenaJoinResponse', EventDir.IN, EventType.JSON, 1 );
        this.registerEvent( 'ArenaPlayerJoined', EventDir.IN, EventType.JSON, 2 );
        this.registerEvent( 'ArenaPlayerRespawn', EventDir.IN, EventType.JSON, 3 );
        this.registerEvent( 'ArenaPlayerRespawn', EventDir.OUT, EventType.JSON, 4 );
        this.registerEvent( 'ArenaPlayerLeft', EventDir.IN, EventType.JSON, 6 );
        this.registerEvent( 'ArenaLeaderboardUpdate', EventDir.IN, EventType.JSON, 7 );
        this.registerEvent( 'ArenaPlayersInRange', EventDir.IN, EventType.BIN, 50 );
        this.registerEvent( 'ArenaTowersInRange', EventDir.IN, EventType.BIN, 60 );
        this.registerEvent( 'ArenaBoxesInRange', EventDir.IN, EventType.BIN, 70 );

        this.registerEvent( 'PlayerFriendlyFire', EventDir.IN, EventType.BIN, 80 );

        this.registerEvent( 'PlayerNewLevel', EventDir.IN, EventType.BIN, 90 );
        this.registerEvent( 'PlayerTankUpdateStats', EventDir.OUT, EventType.BIN, 91 );

        this.registerEvent( 'TankRotateTop', EventDir.IN, EventType.BIN, 100 );
        this.registerEvent( 'TankRotateTop', EventDir.OUT, EventType.BIN, 101 );

        this.registerEvent( 'TankMove', EventDir.IN, EventType.BIN, 111 );
        this.registerEvent( 'TankMove', EventDir.OUT, EventType.BIN, 112 );

        this.registerEvent( 'TankStartShooting', EventDir.OUT, EventType.BIN, 115 );
        this.registerEvent( 'TankStopShooting', EventDir.OUT, EventType.BIN, 116 );
        this.registerEvent( 'TankMakeShot', EventDir.IN, EventType.BIN, 117 );

        this.registerEvent( 'TankUpdateHealth', EventDir.IN, EventType.BIN, 118 );
        this.registerEvent( 'TankUpdateAmmo', EventDir.IN, EventType.BIN, 119 );

        //

        this.registerEvent( 'TowerRotateTop', EventDir.IN, EventType.BIN, 200 );
        this.registerEvent( 'TowerShoot', EventDir.IN, EventType.BIN, 201 );
        this.registerEvent( 'TowerChangeTeam', EventDir.IN, EventType.BIN, 202 );
        this.registerEvent( 'TowerUpdateHealth', EventDir.IN, EventType.BIN, 203 );

        //

        this.registerEvent( 'BulletHit', EventDir.IN, EventType.BIN, 300 );
        this.registerEvent( 'BoxRemove', EventDir.IN, EventType.BIN, 301 );    

        // establish connection

        this.transport = new WebSocket( 'ws://' + this.host + ':8085/ws/game' );
        this.transport.binaryType = 'arraybuffer';

        // add event handlers

        this.transport.addEventListener( 'open', this.onConnect.bind( this ) );
        this.transport.addEventListener( 'close', this.onDisconnected.bind( this ) );
        this.transport.addEventListener( 'error', this.onError.bind( this ) );
        this.transport.addEventListener( 'message', this.onMessage.bind( this ) );

        //

        console.log( 'Network inited.' );

    };

    private onConnect () {

        this.initCallback();

        //

        console.log( '[NETWORK] Connected to server.' );

    };

    private onMessage ( event ) {

        let eventId = new Int16Array( event.data, 0, 1 )[ 0 ];
        let content = new Int16Array( event.data, 2 );

        this.triggerMessageListener( eventId, content );

    };

    private onDisconnected () {

        this.transport = false;
        // ui.showDisconectMessage();

        //

        console.log( '[NETWORK] Connection closed.' );

    };

    private onError ( err ) {

        // todo: handle error

        //

        console.error( '[NETWORK] Connection error: ', err );

    };

    public send ( eventName: string, data: ArrayBuffer | boolean, view?: Int16Array | object | number | string ) {

        if ( ! this.transport ) {

            console.error( '[NETWORK:SEND_MESSAGE] No network socket connection.' );
            return false;

        }

        if ( ! this.events.out[ eventName ] ) {

            console.error( '[NETWORK:SEND_MESSAGE] No event "' + eventName + '" registered.' );
            return false;

        }

        //

        if ( ! data ) {

            let stringData = JSON.stringify( view );
            let binData = TextEncoder.encode( stringData );
    
            var newData = new Uint16Array( binData.length + 1 );
    
            for ( var i = 0, il = binData.length; i < il; i ++ ) {
    
                newData[ i + 1 ] = binData[ i ];
    
            }
    
            data = newData.buffer;
            data[0] = this.events.out[ eventName ].id;
    
        } else {
    
            view[0] = this.events.out[ eventName ].id;

        }
    
        this.transport.send( data, { binary: true, mask: true } );

    };

    public addMessageListener ( eventName: string, callback ) {

        this.messageListeners[ eventName ] = this.messageListeners[ eventName ] || [];
        this.messageListeners[ eventName ].push( callback );

    };

    private triggerMessageListener ( eventId: number, data ) {

        if ( ! this.events.in[ eventId ] ) {

            console.warn( '[NETWORK] Event with ID:' + eventId + ' not found.' );
            return;
    
        }

        //

        let eventName = this.events.in[ eventId ].name;
        let eventType = this.events.in[ eventId ].dataType;
        let listeners = this.messageListeners[ eventName ] || [];

        if ( eventType === EventType.JSON ) {

            data = new Int16Array( data, 2 );
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

    private registerEvent ( eventName: string, eventDir: EventDir, dataType: EventType, eventId: number ) {

        if ( eventDir === EventDir.OUT ) {

            this.events.out[ eventName ] = {
                id:         eventId,
                name:       eventName,
                dataType:   dataType
            };

        } else if ( eventDir === EventDir.IN ) {

            this.events.in[ eventId ] = {
                id:         eventId,
                name:       eventName,
                dataType:   dataType
            };

        }

    };

    //

    constructor () {

        if ( NetworkCore.instance ) {

            return NetworkCore.instance;

        }

        NetworkCore.instance = this;

    };

};

//

export let Network = new NetworkCore();
