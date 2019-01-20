/*
 * @author ohmed
 * DatTank Arena players manager
*/

import { PlayerCore } from '../../core/Player.Core';
import { Arena } from '../../core/Arena.Core';
import { UI } from '../../UI/Core.UI';

//

class PlayerManagerCore {

    private static instance: PlayerManagerCore;
    private players: PlayerCore[] = [];

    //

    public add ( player: PlayerCore ) : void {

        if ( player.id === Arena.meId ) {

            Arena.me = player;
            UI.InGame.showStartingTeamLabel( player.team.name, player.team.color );

        }

        player.init();
        this.players.push( player );

    };

    public removeAll () : void {

        for ( let i = 0, il = this.players.length; i < il; i ++ ) {

            this.players[ i ].dispose();

        }

        this.players = [];

    };

    public remove ( playerIds: number[] ) : void {

        const newPlayersList = [];

        for ( let i = 0, il = this.players.length; i < il; i ++ ) {

            if ( playerIds.indexOf( this.players[ i ].id ) !== -1 ) {

                this.players[ i ].dispose();
                continue;

            }

            newPlayersList.push( this.players[ i ] );

        }

        this.players = newPlayersList;

    };

    public getById ( playerId: number ) : PlayerCore | null {

        for ( let i = 0, il = this.players.length; i < il; i ++ ) {

            if ( this.players[ i ].id === playerId ) {

                return this.players[ i ];

            }

        }

        return null;

    };

    public get () : PlayerCore[] {

        return this.players;

    };

    public update ( time: number, delta: number ) : void {

        for ( let i = 0, il = this.players.length; i < il; i ++ ) {

            this.players[ i ].update( time, delta );

        }

    };

    public init () : void {

        // todo

    };

    constructor () {

        if ( PlayerManagerCore.instance ) {

            return PlayerManagerCore.instance;

        }

        PlayerManagerCore.instance = this;

    };

};

//

export let PlayerManager = new PlayerManagerCore();
