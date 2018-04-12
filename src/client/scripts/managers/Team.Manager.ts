/*
 * @author ohmed
 * DatTank Arena teams manager
*/

import { TeamCore } from "./../core/Team.Core";

//

class TeamManagerCore {

    private static instance: TeamManagerCore;

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

    constructor () {

        if ( TeamManagerCore.instance ) {

            return TeamManagerCore.instance;

        }

        TeamManagerCore.instance = this;

    };

};

//

export let TeamManager = new TeamManagerCore();
