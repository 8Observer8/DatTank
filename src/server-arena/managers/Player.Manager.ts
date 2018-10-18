/*
 * @author ohmed
 * DatTank Player manager sys
*/

import { ArenaCore } from '../core/Arena.Core';
import { PlayerCore } from '../core/Player.Core';

//

export class PlayerManager {

    private arena: ArenaCore;
    private players: PlayerCore[] = [];

    //

    public add ( player: PlayerCore ) : void {

        const team = this.arena.teamManager.getWeakest();
        team.addPlayer( player );
        this.players.push( player );

    };

    public remove ( playerId: number ) : boolean {

        const newPlayerList = [];
        let removed = false;

        //

        for ( let i = 0, il = this.players.length; i < il; i ++ ) {

            if ( this.players[ i ].id === playerId ) {

                removed = true;
                continue;

            }

            newPlayerList.push( this.players[ i ] );

        }

        this.players = newPlayerList;

        return removed;

    };

    public getById ( playerId: number ) : PlayerCore | null {

        for ( let i = 0, il = this.players.length; i < il; i ++ ) {

            if ( this.players[ i ].id === playerId ) {

                return this.players[ i ];

            }

        }

        return null;

    };

    public getPlayers () : PlayerCore[] {

        return this.players;

    };

    public update ( delta: number, time: number ) : void {

        for ( let i = 0, il = this.players.length; i < il; i ++ ) {

            this.players[ i ].update( delta, time );

        }

    };

    public init () : void {

        // todo

    };

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};
