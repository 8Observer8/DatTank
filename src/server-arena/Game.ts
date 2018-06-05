/*
 * @author ohmed
 * Core DatTank file
*/

import { Environment } from "./environments/Detect.Environment";
import { ArenaManager } from "./managers/Arena.Manager";
import { Network } from "./network/Core.Network";

let http = require('http');
let ip = require('ip');

//

export class Game {

    private static instance: Game;

    public id: string;

    private updateInterval: any;
    private updateIntervalTime: number = 10000;

    //

    public updateTopList ( login: string, score: number, kills: number ) {

        let req = http.get({
            hostname:   Environment.master.host,
            port:       Environment.master.port,
            path:       '/api/update-top-list?login=' + encodeURI( login ) + '&kills=' + kills + '&score=' + score
        }, function ( res: any ) {

            let response = '';
            res.setEncoding('utf8');

            res.on( 'data', function ( chunk: string ) {

                response += chunk;

            });

            res.on( 'end', function () {

                response = JSON.parse( response );

            });

        });

    };

    public reportToMaster () {

        let arenas = ArenaManager.getArenas();
        let players = 0;

        for ( let i = 0, il = arenas.length; i < il; i ++ ) {

            let arena = arenas[ i ];

            for ( let j = 0, jl = arena.playerManager.players.length; j < jl; j ++ ) {

                if ( arena.playerManager.players[ j ].socket ) {

                    players ++;

                }

            }

        }

        //

        let req = http.get({
            hostname:   Environment.master.host,
            port:       Environment.master.port,
            path:       '/api/status-update?aid=' + this.id + '&players=' + players + '&ip=' + ip.address()
        }, function ( res: any ) {

            let response = '';
            res.setEncoding('utf8');

            res.on( 'data', function ( chunk: string ) {

                response += chunk;

            });

            res.on( 'end', function () {

                response = JSON.parse( response );

            });

        });

    };

    public init () {

        Network.init();

        this.updateInterval = setInterval( this.reportToMaster.bind( this ), this.updateIntervalTime );
        this.reportToMaster();

    };

    //

    constructor () {

        if ( Game.instance ) {

            console.warn('Game instance already created!');
            return Game.instance;

        }

        this.id = ( new Date().getTime() ).toString(36);
        this.init();

        Game.instance = this;

    };

};
