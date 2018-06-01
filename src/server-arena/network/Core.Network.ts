/*
 * @author ohmed
 * DatTank Network Core sys
*/

import { TextEncoder } from "./../utils/TextEncoder";
import * as ws from "ws";

import { Environment } from "./../environments/Detect.Environment";

//

enum EventDir { IN = 'in', OUT = 'out' };
enum EventType { BIN = 0, JSON = 1 };

//

class NetworkCore {

    private io: any;

    private messageListeners = {};
    private events = {
        in:     {},
        out:    {}
    };

    //

    private registerEvent ( eventName: string, eventDir: EventDir, dataType: EventType, eventId: number ) {

        // todo

    };

    private onConnect ( socket: ws ) {

        // todo

    };

    private onDisconnect ( socket: ws ) {

        // todo

    };

    private onError ( socket: ws, error: any ) {

        // todo

    };

    private onMessage ( socket: ws, data: any ) {

        // todo

    };

    private send ( eventName: string, socket: ws, data: any, dataView?: any ) {

        // todo

    };

    private triggerMessageListener ( eventId: number, data: any, socket: ws ) {

        // todo

    };

    public init () {

        // todo: register events

        // enable io

        this.io = new ws.Server({ port: Environment.web.socketPort });
        this.io.on( 'connection', this.onConnect.bind( this ) );

        //

        console.log( '> DatTank ArenaServer: Network started on port ' + Environment.web.socketPort );

    };

};

//

export let Network = new NetworkCore();
