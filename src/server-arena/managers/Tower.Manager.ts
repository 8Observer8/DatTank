/*
 * @author ohmed
 * DatTank Tower manager sys
*/

import { ArenaCore } from "./../core/Arena.Core";
import { TowerObject } from "./../objects/core/Tower.Object";

//

class TowerManager {

    private towers: Array<TowerObject> = [];

    public arena: ArenaCore;

    //

    public add ( tower: TowerObject ) {

        this.towers.push( tower );

    };

    public getById ( towerId: number ) {

        for ( let i = 0, il = this.towers.length; i < il; i ++ ) {

            if ( this.towers[ i ].id === towerId ) {

                return this.towers[ i ];

            }

        }

        return null;

    };

    public getTowers () {

        return this.towers;

    };

    public update ( delta: number, time: number ) {

        for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

            this.towers[ i ].update( delta, time );

        }

    };

    public init () {

        let team = this.arena.teamManager.getById( ArenaCore.NeutralTeam );

        for ( let i = 0; i < 5; i ++ ) {

            for ( let j = 0; j < 5; j ++ ) {

                let x = ( 0.5 - i / 4 ) * 1900;
                let z = ( 0.5 - j / 4 ) * 1900;

                this.add( new TowerObject( this.arena, { team: team, position: { x: x, y: 0, z: z } } ) );

            }

        }

    };

    public toJSON () {

        let towers = [];

        for ( let i = 0, il = this.towers.length; i < il; i ++ ) {

            towers.push( this.towers[ i ].toJSON() );

        }

        return towers;

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};

//

export { TowerManager };
