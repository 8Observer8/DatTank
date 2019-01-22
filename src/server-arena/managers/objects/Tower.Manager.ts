/*
 * @author ohmed
 * DatTank Tower manager sys
*/

import * as OMath from '../../OMath/Core.OMath';
import { ArenaCore } from '../../core/Arena.Core';
import { TowerObject } from '../../objects/core/Tower.Object';

//

export class TowerManager {

    private towers: TowerObject[] = [];
    public arena: ArenaCore;

    //

    public add ( tower: TowerObject ) : void {

        this.towers.push( tower );

    };

    public getById ( towerId: number ) : TowerObject | null {

        for ( let i = 0, il = this.towers.length; i < il; i ++ ) {

            if ( this.towers[ i ].id === towerId ) {

                return this.towers[ i ];

            }

        }

        return null;

    };

    public getTowers () : TowerObject[] {

        return this.towers;

    };

    public update ( delta: number, time: number ) : void {

        for ( let i = 0, il = this.towers.length; i < il; i ++ ) {

            this.towers[ i ].update( delta, time );

        }

    };

    public init () : void {

        const team = this.arena.teamManager.getById( ArenaCore.NeutralTeam );
        const pos = new OMath.Vec3();

        for ( let i = 0; i < 3; i ++ ) {

            for ( let j = 0; j < 3; j ++ ) {

                pos.x = ( 0.5 - i / 2 ) * 1900;
                pos.z = ( 0.5 - j / 2 ) * 1900;

                const isBase = ( i === 0 && j === 0 ) || ( i === 0 && j === 2 ) || ( i === 2 && j === 0 ) || ( i === 2 && j === 2 );
                const tower = new TowerObject( this.arena, { team, position: pos, isBase } );
                this.add( tower );

                if ( i === 0 && j === 0 ) tower.changeTeam( this.arena.teamManager.getById( 0 ) );
                if ( i === 0 && j === 2 ) tower.changeTeam( this.arena.teamManager.getById( 2 ) );
                if ( i === 2 && j === 0 ) tower.changeTeam( this.arena.teamManager.getById( 1 ) );
                if ( i === 2 && j === 2 ) tower.changeTeam( this.arena.teamManager.getById( 3 ) );

            }

        }

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};
