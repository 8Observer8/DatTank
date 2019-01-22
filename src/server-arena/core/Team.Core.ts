/*
 * @author ohmed
 * DatTank Team Core
*/

import * as OMath from '../OMath/Core.OMath';
import { PlayerCore } from './Player.Core';

//

export class TeamCore {

    private static StartPositions = {
        0:        new OMath.Vec3(   950, 25,   950 ),
        1:        new OMath.Vec3( - 950, 25,   950 ),
        2:        new OMath.Vec3(   950, 25, - 950 ),
        3:        new OMath.Vec3( - 950, 25, - 950 ),
        1000:     new OMath.Vec3(     0, 25,     0 ),
    };

    public id: number;
    public players: PlayerCore[] = [];
    public kills: number = 0;
    public death: number = 0;
    public towers: number = 0;
    public spawnPosition: OMath.Vec3 = new OMath.Vec3();

    //

    public reset () : void {

        this.players = [];
        this.kills = 0;
        this.death = 0;
        this.towers = 0;

    };

    public addPlayer ( player: PlayerCore ) : void {

        this.players.push( player );
        player.team = this;

    };

    public removePlayer ( playerId: number ) : void {

        const newPlayersList = [];

        for ( let i = 0, il = this.players.length; i < il; i ++ ) {

            if ( this.players[ i ].id === playerId ) continue;
            newPlayersList.push( this.players[ i ] );

        }

        this.players = newPlayersList;

    };

    public toJSON () : any {

        return {
            id:             this.id,
            kills:          this.kills,
            death:          this.death,
            spawnPosition:  this.spawnPosition.toJSON(),
        };

    };

    //

    constructor ( id: number ) {

        this.id = id;
        this.spawnPosition = TeamCore.StartPositions[ this.id.toString() ];

    };

};
