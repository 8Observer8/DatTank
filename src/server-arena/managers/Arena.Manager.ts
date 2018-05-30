/*
 * @author ohmed
 * DatTank Arena Manager system
*/

import { ArenaCore } from "./../core/Arena.Core";

//

class ArenaManagerCore {

    private static instance: ArenaManagerCore;

    private arenas: any = [];
    public maxPlayersInArena: number = 24;

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
        let arena = false;

        if ( this.arenas.length === 1 ) return;

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            arena = this.arenas[ i ];

            // if ( ! arena || ! arena.playerManager.players ) continue;
            // if ( arena.playerManager.players.length - arena.botManager.bots.length === 0 ) {

            //     arena.clear();
            //     continue;

            // }

            newArenaList.push( arena );

        }

        this.arenas = newArenaList;

    };

    public findArena () {

        let arena: ArenaCore;
        let minArena = false;
        let avgArena = false;
        let players = false;
        let bots = false;
        let livePlayers = false;

        this.removeEmptyArenas();

        //

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            arena = this.arenas[ i ];
            // players = arena.playerManager.players;
            // bots = arena.botManager.bots;
            // livePlayers = players.length - bots.length;

            // if ( livePlayers < this.maxPlayersInArena && players > 5 ) {

            //     avgArena = this.arenas[ i ];

            // }

            // if ( ( ! minArena && livePlayers < this.maxPlayersInArena ) || ( minArena && livePlayers < minArena.playerManager.players.length - minArena.botManager.bots.length ) ) {

            //     minArena = arena;

            // }

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

        for ( var i = 0, il = this.arenas.length; i < il; i ++ ) {

            if ( this.arenas[ i ].id === arenaId ) {

                return this.arenas[ i ];

            }

        }

        return false;

    };

    public getArenas () {

        return this.arenas;

    };

    public playerJoin ( data: any, socket: any ) {

        let arena: ArenaCore = this.findArena();
        // let player = arena.addPlayer({ login: data.login, tank: data.tank, socket: socket });
        // let response = arena.toJSON();
        // response.me = player.toPrivateJSON();

        // networkManager.send( 'ArenaJoinResponse', socket, false, response );

    };

    //

    constructor () {

        if ( ArenaManagerCore.instance ) {

            return ArenaManagerCore.instance;

        }

        ArenaManagerCore.instance = this;

    };

};

//

export let ArenaManager = new ArenaManagerCore();
