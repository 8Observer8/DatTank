/*
 * @author ohmed
 * Core DatTank file
*/

import * as http from 'http';
import * as ip from 'ip';

import { Environment } from './environments/Detect.Environment';
import { ArenaManager } from './managers/Arena.Manager';
import { GarageManager } from './managers/Garage.Manager';
import { Network } from './network/Core.Network';

//

class GameCore {

    private static instance: GameCore;

    public id: string;
    private updateIntervalTime: number = 10000;

    //

    public updateTopList ( login: string, score: number, kills: number ) : void {

        http.get({
            hostname:   Environment.master.host,
            port:       Environment.master.port,
            path:       '/api/update-top-list?login=' + encodeURI( login ) + '&kills=' + kills + '&score=' + score,
        }, ( res: any ) => {

            let response = '';
            res.setEncoding('utf8');

            res.on( 'data', ( chunk: string ) => {

                response += chunk;

            });

            res.on( 'end', () => {

                response = JSON.parse( response );

            });

        });

    };

    public reportToMaster () : void {

        const arenas = ArenaManager.getArenas();
        let players = 0;

        for ( let i = 0, il = arenas.length; i < il; i ++ ) {

            const arena = arenas[ i ];
            const playersList = arena.playerManager.getPlayers();

            for ( let j = 0, jl = playersList.length; j < jl; j ++ ) {

                if ( playersList[ j ].socket ) {

                    players ++;

                }

            }

        }

        //

        http.get({
            hostname:   Environment.master.host,
            port:       Environment.master.port,
            path:       '/api/status-update?aid=' + this.id + '&players=' + players + '&ip=' + ip.address(),
        }, ( res: any ) => {

            let response = '';
            res.setEncoding('utf8');

            res.on( 'data', ( chunk: string ) => {

                response += chunk;

            });

            res.on( 'end', () => {

                response = JSON.parse( response );

            });

        });

    };

    public init () : void {

        Network.init();

        setInterval( this.reportToMaster.bind( this ), this.updateIntervalTime );
        this.reportToMaster();
        this.loadGarageConfig();

    };

    private loadGarageConfig () : void {

        http.get({
            hostname:   Environment.master.host,
            port:       Environment.master.port,
            path:       '/api/garage/getObjects',
        }, ( res: any ) => {

            let response = '';
            res.setEncoding('utf8');

            res.on( 'data', ( chunk: string ) => {

                response += chunk;

            });

            res.on( 'end', () => {

                const data = JSON.parse( response );
                GarageManager.set( data );

            });

        });

    };

    //

    constructor () {

        if ( GameCore.instance ) {

            return GameCore.instance;

        }

        this.id = ( new Date().getTime() ).toString(36);

        GameCore.instance = this;

    };

};

export let Game = new GameCore();
