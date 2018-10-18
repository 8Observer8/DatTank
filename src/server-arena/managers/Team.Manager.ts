/*
 * @author ohmed
 * DatTank Team manager sys
*/

import { TeamCore } from '../core/Team.Core';

//

export class TeamManager {

    private teams: TeamCore[] = [];

    //

    public add ( team: TeamCore ) : void {

        this.teams.push( team );

    };

    public getWeakest () : TeamCore {

        let weakestTeam = this.teams[0];

        for ( let i = 1, il = this.teams.length; i < il; i ++ ) {

            if ( this.teams[ i ].id >= 1000 ) continue;

            if ( weakestTeam.players.length > this.teams[ i ].players.length ) {

                weakestTeam = this.teams[ i ];

            }

        }

        return weakestTeam;

    };

    public getById ( teamId: number ) : TeamCore | null {

        for ( let i = 0, il = this.teams.length; i < il; i ++ ) {

            if ( this.teams[ i ].id === teamId ) {

                return this.teams[ i ];

            }

        }

        return null;

    };

    public getTeams () : TeamCore[] {

        return this.teams;

    };

    public init ( teamNum: number ) : void {

        teamNum = teamNum || 4;

        for ( let i = 0; i < teamNum; i ++ ) {

            this.add( new TeamCore( i ) );

        }

        this.add( new TeamCore( 1000 ) );

    };

    public toJSON () : any[] {

        const teamsJSON = [];

        for ( let i = 0, il = this.teams.length; i < il; i ++ ) {

            teamsJSON.push( this.teams[ i ].toJSON() );

        }

        return teamsJSON;

    };

};
