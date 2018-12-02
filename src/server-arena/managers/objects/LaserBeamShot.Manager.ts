/*
 * @author ohmed
 * DatTank LaserBeam manager sys
*/

import { ArenaCore } from '../../core/Arena.Core';
import { LaserBeamShotObject } from '../../objects/core/LaserBeamShot.Object';

//

export class LaserBeamShotManager {

    private laserBeams: LaserBeamShotObject[] = [];
    public arena: ArenaCore;

    //

    public getInactiveLaserBeam () : LaserBeamShotObject {

        for ( let i = 0, il = this.laserBeams.length; i < il; i ++ ) {

            if ( ! this.laserBeams[ i ].active ) {

                return this.laserBeams[ i ];

            }

        }

        const laserBeam = new LaserBeamShotObject( this.arena, {} );
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

            this.laserBeams.push( new LaserBeamShotObject( this.arena, {} ) );

        }

    };

};
