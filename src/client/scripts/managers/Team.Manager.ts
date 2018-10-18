/*
 * @author ohmed
 * DatTank Arena teams manager
*/

import { TeamCore } from '../core/Team.Core';

//

class TeamManagerCore {

    private static instance: TeamManagerCore;

    private teams: TeamCore[] = [];

    //

    public add ( team: TeamCore ) : void {

        this.teams.push( team );

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

    //

    public init ( params: any ) : void {

        for ( let i = 0, il = params.length; i < il; i ++ ) {

            this.add( new TeamCore( params[ i ] ) );

        }

    };

    constructor () {

        if ( TeamManagerCore.instance ) {

            return TeamManagerCore.instance;

        }

        TeamManagerCore.instance = this;

    };

};

//

export let TeamManager = new TeamManagerCore();
