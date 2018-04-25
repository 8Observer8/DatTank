/*
 * @author ohmed
 * DatTank Arena players manager
*/

import { PlayerCore } from "./../core/Player.Core";
import { Arena } from "./../core/Arena.Core";

//

class PlayerManagerCore {

    private static instance: PlayerManagerCore;
    private players: Array<PlayerCore> = [];

    //

    public add ( player: PlayerCore ) {

        if ( player.id === Arena.meId ) {

            Arena.me = player;
    
        }
    
        this.players.push( player );

    };

    public remove ( playerId: number ) {

        var newPlayersList = [];
    
        for ( var i = 0, il = this.players.length; i < il; i ++ ) {
    
            if ( this.players[ i ].id === playerId ) {
    
                this.players[ i ].tank.dispose();
                continue;
    
            }
    
            newPlayersList.push( this.players[ i ] );
    
        }
    
        this.players = newPlayersList;

    };

    public getById ( playerId: number ) {

        for ( var i = 0, il = this.players.length; i < il; i ++ ) {

            if ( this.players[ i ].id === playerId ) {
    
                return this.players[ i ];
    
            }
    
        }
    
        return null;

    };

    public get () {

        return this.players;

    };

    public update ( time: number, delta: number ) {

        for ( let i = 0, il = this.players.length; i < il; i ++ ) {

            this.players[ i ].update( time, delta );

        }

    };

    public init () {

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
