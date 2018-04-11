/*
 * @author ohmed
 * DatTank Arena teams manager
*/

import { TeamCore } from "./../core/Team.Core";

//

class TeamManager {

    private teams: Array<TeamCore> = [];

    //

    public add ( team: TeamCore ) {

        this.teams.push( team );

    };

    public getById ( teamId: number ) {

        for ( var i = 0, il = this.teams.length; i < il; i ++ ) {

            if ( this.teams[ i ].id === teamId ) {

                return this.teams[ i ];

            }

        }

        return null;

    };

    //

    public init ( params ) {

        for ( var i = 0, il = params.length; i < il; i ++ ) {

            this.add( new TeamCore( params[ i ] ) );

        }

    };

};

//

export { TeamManager };
