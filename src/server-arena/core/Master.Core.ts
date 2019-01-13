/*
 * @author ohmed
 * Arena Master service
*/

import * as http from 'http';
import * as ip from 'ip';
import * as request from 'request';

import { Environment } from '../environments/Detect.Environment';
import { ArenaManager } from '../managers/core/Arena.Manager';
import { GarageManager } from '../managers/core/Garage.Manager';

//

class MasterCore {

    private static instance: MasterCore;

    //

    public updateTopList ( login: string, score: number, kills: number, death: number, level: number ) : void {

        http.get({
            hostname:   Environment.master.host,
            port:       Environment.master.port,
            path:       '/api/update-top-list?login=' + encodeURI( login ) + '&kills=' + kills + '&score=' + score + '&death=' + death + '&level=' + level,
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
        let bots = 0;
        let bullets = 0;
        let cannonObjects = 0;

        for ( let i = 0, il = arenas.length; i < il; i ++ ) {

            const arena = arenas[ i ];
            bullets += arena.bulletShotManager.getCount();
            cannonObjects += arena.collisionManager.getObjectsCount();
            const playersList = arena.playerManager.getPlayers();

            for ( let j = 0, jl = playersList.length; j < jl; j ++ ) {

                if ( playersList[ j ].socket ) {

                    players ++;

                } else {

                    bots ++;

                }

            }

        }

        //

        http.get({
            hostname:   Environment.master.host,
            port:       Environment.master.port,
            path:       '/api/status-update?aid=' + serverId + '&players=' + players + '&ip=' + Environment.arena.host || ip.address() + '&bots=' + bots + '&bullets=' + bullets + '&cannonObjects=' + cannonObjects,
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

    public setPlayerStats ( pid: string, sid: string, coins: number, xp: number, level: number ) : void {

        const options = {
            uri:    'http://' + Environment.master.host + ':' + Environment.master.port + '/api/player/save',
            method: 'POST',
            json: {
                pid, sid, coins, xp, level,
            },
        };

        request( options, () => {

            // nothing here

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
