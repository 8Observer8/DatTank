/*
 * @author ohmed
 * DatTank Arena large explosion manager
*/

import { LargeExplosionGfx } from '../graphics/effects/LargeExplosion.Gfx';
import * as OMath from '../OMath/Core.OMath';

//

class LargeExplosionManagerCore {

    private static instance: LargeExplosionManagerCore;
    private pool: LargeExplosionGfx[] = [];
    private poolSize: number = 10;

    //

    private getNewExplosion () : LargeExplosionGfx | null {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].active === false ) {

                return this.pool[ i ];

            }

        }

        return null;

    };

    public update ( time: number, delta: number ) : void {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            this.pool[ i ].update( time, delta );

        }

    };

    public showExplosion ( position: OMath.Vec3 ) : void {

        const largeExplosion = this.getNewExplosion();
        if ( ! largeExplosion ) return;
        largeExplosion.setActive( position );

    };

    public init () : void {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            const explosion = new LargeExplosionGfx();
            explosion.init();
            this.pool.push( explosion );

        }

    };

    //

    constructor () {

        if ( LargeExplosionManagerCore.instance ) {

            return LargeExplosionManagerCore.instance;

        }

        LargeExplosionManagerCore.instance = this;

    };

};

//

export let LargeExplosionManager = new LargeExplosionManagerCore();
