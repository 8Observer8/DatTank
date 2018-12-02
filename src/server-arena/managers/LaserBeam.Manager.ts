/*
 * @author ohmed
 * DatTank LaserBeam manager sys
*/

import { ArenaCore } from '../core/Arena.Core';
import { LaserBeamObject } from '../objects/core/LaserBeam.Object';

//

export class LaserBeamManager {

    private laserBeams: LaserBeamObject[] = [];
    public arena: ArenaCore;

    //

    public getInactiveLaserBeam () : LaserBeamObject {

        for ( let i = 0, il = this.laserBeams.length; i < il; i ++ ) {

            if ( ! this.laserBeams[ i ].active ) {

                return this.laserBeams[ i ];

            }

        }

        const laserBeam = new LaserBeamObject( this.arena, {} );
        this.laserBeams.push( laserBeam );

        return laserBeam;

    };

    public init () : void {

        // todo

    };

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

        //

        for ( let i = 0; i < 10; i ++ ) {

            this.laserBeams.push( new LaserBeamObject( this.arena, {} ) );

        }

    };

};
