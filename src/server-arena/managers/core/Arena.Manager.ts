/*
 * @author ohmed
 * DatTank Arena Manager system
*/

import * as ws from 'ws';

import { ArenaCore } from '../../core/Arena.Core';
import { ArenaManagerNetwork } from '../../network/ArenaManager.Network';
import { PlayerCore } from '../../core/Player.Core';

//

class ArenaManagerCore {

    private static instance: ArenaManagerCore;

    private arenas: any = [];
    public maxPlayersInArena: number = 27;

    public network: ArenaManagerNetwork;

    //

    public addArena () : ArenaCore {

        const arena = new ArenaCore();
        this.arenas.push( arena );

        return arena;

    };

    public removeArena ( arenaId: number ) : void {

        if ( this.arenas.length === 1 ) return;

        const newArenaList = [];

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            if ( this.arenas[ i ].id === arenaId ) continue;
            newArenaList.push( this.arenas[ i ] );

        }

        this.arenas = newArenaList;

    };

    public removeEmptyArenas () : void {

        const newArenaList = [];

        if ( this.arenas.length === 1 ) return;

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            const arena = this.arenas[ i ];
            const players = arena.playerManager.getPlayers();
            const bots = arena.botManager.getBots();

            if ( ! arena || ! players ) continue;

            if ( players.length - bots.length === 0 ) {

                arena.clear();
                continue;

            }

            newArenaList.push( arena );

        }

        this.arenas = newArenaList;

    };

    public findArena () : ArenaCore {

        let arena: ArenaCore;
        let minArena: ArenaCore | undefined;
        let avgArena: ArenaCore | undefined;

        this.removeEmptyArenas();

        //

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            arena = this.arenas[ i ];

            const players = arena.playerManager.getPlayers();
            const bots = arena.botManager.getBots();
            const livePlayers = players.length - bots.length;

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

    public getArenaById ( arenaId: number ) : ArenaCore | null {

        for ( let i = 0, il = this.arenas.length; i < il; i ++ ) {

            if ( this.arenas[ i ].id === arenaId ) {

                return this.arenas[ i ];

            }

        }

        return null;

    };

    public getArenas () : ArenaCore[] {

        return this.arenas;

    };

    public playerJoin ( data: any, socket: ws ) : void {

        const arena: ArenaCore = this.findArena();

        arena.addPlayer({
            pid: data.pid,
            sid: data.sid,
            login: data.login,
            tankConfig: data.tankConfig,
            socket,
        }, ( player: PlayerCore ) => {

            arena.network.joinArena( player );

        });

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
