/*
 * @author ohmed
 * DatTank Arena Manager system
*/

import * as ws from "ws";

import { ArenaCore } from "./../core/Arena.Core";
import { ArenaManagerNetwork } from "./../network/ArenaManager.Network";

//

class ArenaManagerCore {

    private static instance: ArenaManagerCore;

    private arenas: any = [];
    public maxPlayersInArena: number = 24;

    public network: ArenaManagerNetwork;

    //

    public addArena () {

        let arena = new ArenaCore();
        this.arenas.push( arena );

        return arena;

    };

    public removeArena ( arenaId: number ) {

        if ( this.arenas.length === 1 ) return;

        let newArenaList = [];

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            if ( this.arenas[ i ].id === arenaId ) continue;
            newArenaList.push( this.arenas[ i ] );

        }

        this.arenas = newArenaList;

    };

    public removeEmptyArenas () {

        let newArenaList = [];

        if ( this.arenas.length === 1 ) return;

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            let arena = this.arenas[ i ];
            let players = arena.playerManager.getPlayers();
            let bots = arena.botManager.getBots();

            if ( ! arena || ! players ) continue;

            if ( players.length - bots.length === 0 ) {

                arena.clear();
                continue;

            }

            newArenaList.push( arena );

        }

        this.arenas = newArenaList;

    };

    public findArena () {

        let arena: ArenaCore;
        let minArena: ArenaCore | undefined = undefined;
        let avgArena: ArenaCore | undefined = undefined;

        this.removeEmptyArenas();

        //

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            arena = this.arenas[ i ];

            let players = arena.playerManager.getPlayers();
            let bots = arena.botManager.getBots();
            let livePlayers = players.length - bots.length;

            if ( livePlayers < this.maxPlayersInArena && players.length > 5 ) {

                avgArena = this.arenas[ i ];

            }

            if ( ( ! minArena && livePlayers < this.maxPlayersInArena ) || ( minArena && livePlayers < minArena.playerManager.getPlayers().length - minArena.botManager.getBots().length ) ) {

                minArena = arena;

            }

        }

        if ( ! avgArena ) {

            if ( ! minArena ) {

                arena = this.addArena();

            } else {

                arena = minArena;

            }

        } else {

            arena = avgArena;

        }

        return arena;

    };

    public getArenaById ( arenaId: number ) {

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            if ( this.arenas[ i ].id === arenaId ) {

                return this.arenas[ i ];

            }

        }

        return false;

    };

    public getArenas () {

        return this.arenas;

    };

    public playerJoin ( data: any, socket: ws ) {

        let arena: ArenaCore = this.findArena();
        let player = arena.addPlayer({ login: data.login, tank: data.tank, socket: socket });

        arena.network.joinArena( player );

    };

    //

    constructor () {

        if ( ArenaManagerCore.instance ) {

            return ArenaManagerCore.instance;

        }

        this.network = new ArenaManagerNetwork();

        ArenaManagerCore.instance = this;

    };

};

//

export let ArenaManager = new ArenaManagerCore();
