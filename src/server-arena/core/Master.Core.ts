/*
 * @author ohmed
 * Arena Master service
*/

import * as http from 'http';
import * as ip from 'ip';

import { Environment } from '../environments/Detect.Environment';
import { ArenaManager } from '../managers/Arena.Manager';
import { GarageManager } from '../managers/Garage.Manager';

//

class MasterCore {

    private static instance: MasterCore;

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

    public report ( serverId: string ) : void {

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
            path:       '/api/status-update?aid=' + serverId + '&players=' + players + '&ip=' + ip.address(),
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

    public loadGarageConfig () : void {

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

    public getPlayerInfo ( pid: string, sid: string, callback: ( data: any ) => void ) : void {

        http.get({
            hostname:   Environment.master.host,
            port:       Environment.master.port,
            path:       '/api/player/get?pid=' + pid + '&sid=' + sid,
        }, ( res: any ) => {

            let response = '';
            res.setEncoding('utf8');

            res.on( 'data', ( chunk: string ) => {

                response += chunk;

            });

            res.on( 'end', () => {

                const data = JSON.parse( response );
                callback( data );

            });

        });

    };

    //

    constructor () {

        if ( MasterCore.instance ) {

            return MasterCore.instance;

        }

        MasterCore.instance = this;

    };

};

//

export const Master = new MasterCore();
