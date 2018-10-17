/*
 * @author ohmed
 * DatTank Network
*/

import { TextEncoder } from "./../utils/TextEncoder";
import { UI } from "./../ui/Core.UI";

//

enum EventDir { IN = 'in', OUT = 'out' };
enum EventType { BIN = 0, JSON = 1 };

//

class NetworkCore {

    private static instance: NetworkCore;

    private transport: WebSocket | null;
    private messageListeners: object = {};
    private initCallback: () => void;

    private host: string;
    private port: number;

    private events = {
        in:     {},
        out:    {}
    };

    //

    public init ( server: any, callback: () => void ) {

        if ( this.transport ) {

            console.error( '[NETWORK] Connection already established.' );
            return;

        }

        this.initCallback = callback;
        this.host = server.ip;
        this.port = ( window.location.hostname === 'localhost' ) ? 8093 : 80;

        // register network events

        this.registerEvent( 'ArenaJoinRequest', EventDir.OUT, EventType.JSON, 0 );
        this.registerEvent( 'ArenaJoinResponse', EventDir.IN, EventType.JSON, 1 );
        this.registerEvent( 'ArenaPlayerJoined', EventDir.IN, EventType.JSON, 2 );
        this.registerEvent( 'ArenaPlayerLeft', EventDir.IN, EventType.BIN, 6 );
        this.registerEvent( 'ArenaLeaderboardUpdate', EventDir.IN, EventType.JSON, 7 );
        this.registerEvent( 'ArenaPlayerDied', EventDir.IN, EventType.JSON, 10 );
        this.registerEvent( 'ArenaTanksInRange', EventDir.IN, EventType.BIN, 50 );
        this.registerEvent( 'ArenaTowersInRange', EventDir.IN, EventType.BIN, 60 );
        this.registerEvent( 'ArenaBoxesInRange', EventDir.IN, EventType.BIN, 70 );
        this.registerEvent( 'ArenaChatMessage', EventDir.OUT, EventType.JSON, 75 );
        this.registerEvent( 'ArenaChatMessage', EventDir.IN, EventType.JSON, 76 );
        this.registerEvent( 'ArenaKillSerie', EventDir.IN, EventType.JSON, 95 );

        //

        this.registerEvent( 'PlayerRespawn', EventDir.IN, EventType.JSON, 3 );
        this.registerEvent( 'PlayerRespawn', EventDir.OUT, EventType.BIN, 4 );

        this.registerEvent( 'PlayerNewLevel', EventDir.IN, EventType.BIN, 90 );
        this.registerEvent( 'PlayerTankUpdateStats', EventDir.OUT, EventType.BIN, 91 );

        //

        this.registerEvent( 'TankFriendlyFire', EventDir.IN, EventType.BIN, 80 );

        this.registerEvent( 'TankRotateTop', EventDir.IN, EventType.BIN, 100 );
        this.registerEvent( 'TankRotateTop', EventDir.OUT, EventType.BIN, 101 );
        this.registerEvent( 'TankMove', EventDir.IN, EventType.BIN, 111 );
        this.registerEvent( 'TankMove', EventDir.OUT, EventType.BIN, 112 );

        this.registerEvent( 'TankStartShooting', EventDir.OUT, EventType.BIN, 115 );
        this.registerEvent( 'TankStopShooting', EventDir.OUT, EventType.BIN, 116 );
        this.registerEvent( 'TankMakeShot', EventDir.IN, EventType.BIN, 117 );

        this.registerEvent( 'TankSetHealth', EventDir.IN, EventType.BIN, 118 );
        this.registerEvent( 'TankSetAmmo', EventDir.IN, EventType.BIN, 119 );

        //

        this.registerEvent( 'TowerRotateTop', EventDir.IN, EventType.BIN, 200 );
        this.registerEvent( 'TowerMakeShot', EventDir.IN, EventType.BIN, 201 );
        this.registerEvent( 'TowerChangeTeam', EventDir.IN, EventType.BIN, 202 );
        this.registerEvent( 'TowerSetHealth', EventDir.IN, EventType.BIN, 203 );

        //

        this.registerEvent( 'ArenaBulletHit', EventDir.IN, EventType.BIN, 300 );
        this.registerEvent( 'ArenaBoxRemove', EventDir.IN, EventType.BIN, 301 );

        //

        this.registerEvent( 'PING', EventDir.OUT, EventType.BIN, 1000 );
        this.registerEvent( 'PONG', EventDir.IN, EventType.BIN, 1001 );

        // establish connection

        this.transport = new WebSocket( 'ws://' + this.host + ':' + this.port + '/ws/game' );
        this.transport.binaryType = 'arraybuffer';

        // add event handlers

        this.transport.addEventListener( 'open', this.onConnect.bind( this ) );
        this.transport.addEventListener( 'close', this.onDisconnected.bind( this ) );
        this.transport.addEventListener( 'error', this.onError.bind( this ) );
        this.transport.addEventListener( 'message', this.onMessage.bind( this ) );

        this.addMessageListener( 'PONG', this.gotPong.bind( this ) );
        setInterval( this.sendPing.bind( this ), 5000 );

        //

        console.log( 'Network inited.' );

    };

    private onConnect () {

        this.initCallback();

        //

        console.log( '[NETWORK] Connected to server.' );

    };

    private onMessage ( event: any ) {

        let eventId = new Int16Array( event.data, 0, 1 )[ 0 ];
        let content = new Int16Array( event.data, 2 );

        this.triggerMessageListener( eventId, content );

    };

    private onDisconnected () {

        this.transport = null;
        UI.InGame.showDisconectMessage();

        //

        console.log( '[NETWORK] Connection closed.' );

    };

    private onError ( err: any ) {

        // todo: handle error

        //

        console.error( '[NETWORK] Connection error: ', err );

    };

    public send ( eventName: string, data: ArrayBuffer | boolean | Int16Array, view?: Int16Array | object | number | string ) : boolean {

        if ( ! this.transport ) {

            // console.error( '[NETWORK:SEND_MESSAGE] No network socket connection.' );
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

            var newData = new Int16Array( binData.length + 1 );

            for ( var i = 0, il = binData.length; i < il; i ++ ) {

                newData[ i + 1 ] = binData[ i ];

            }

            newData[0] = this.events.out[ eventName ].id;
            data = newData;

        } else if ( view ) {

            view[0] = this.events.out[ eventName ].id;

        } else {

            return false;

        }

        this.transport.send( data as ArrayBuffer );
        return true;

    };

    public addMessageListener ( eventName: string, callback: ( data: any ) => void ) {

        this.messageListeners[ eventName ] = this.messageListeners[ eventName ] || [];
        this.messageListeners[ eventName ].push( callback );

    };

    public removeMessageListener ( eventName: string, callback: ( data: any ) => void ) {

        let newMassageListenersList = [];

        for ( let i = 0, il = this.messageListeners[ eventName ].length; i < il; i ++ ) {

            if ( this.messageListeners[ eventName ][ i ] === callback ) continue;
            newMassageListenersList.push( this.messageListeners[ eventName ][ i ] );

        }

        this.messageListeners[ eventName ] = newMassageListenersList;

    };

    private triggerMessageListener ( eventId: number, data: any ) {

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

    private sendPing () {

        let buffer = new ArrayBuffer( 4 );
        let bufferView = new Int16Array( buffer );

        bufferView[1] = Date.now() % 1000;

        this.send( 'PING', buffer, bufferView );

    };

    private gotPong ( data: number[] ) {

        let ping = Math.round( ( ( Date.now() % 1000 ) - data[0] ) / 2 );
        ping = ( ping < 0 ) ? ping + 500 : ping;
        UI.InGame.updatePing( ping );

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
