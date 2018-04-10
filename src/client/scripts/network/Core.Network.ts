/*
 * @author ohmed
 * DatTank Network
*/

enum EventDir { IN = 'in', OUT = 'out' };
enum EventType { BIN = 0, JSON = 1 };

//

class Network {

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

    public send ( eventName: string, data: ArrayBuffer | boolean, view?: Int16Array | object ) {

        if ( ! this.transport ) {

            console.error( '[NETWORK:SEND_MESSAGE] No network socket connection.' );
            return false;

        }

        if ( ! this.events.out[ eventName ] ) {

            console.error( '[NETWORK:SEND_MESSAGE] No event "' + eventName + '" registered.' );
            return false;

        }

        // todo

    };

    public addMessageListener ( eventName: string, callback ) {

        this.messageListeners[ eventName ] = this.messageListeners[ eventName ] || [];
        this.messageListeners[ eventName ].push( callback );

    };

    private triggerMessageListener ( eventId: number, data ) {

        // todo

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

};

//

export { Network };
