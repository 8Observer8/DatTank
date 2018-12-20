/*
 * @author ohmed
 * Arena tank death explosion manager
*/

import { DeathExplosionGfx } from '../effects/explosions/DeathExplosion.Gfx';
import * as OMath from '../../OMath/Core.OMath';

//

class DeathExplosionManagerCore {

    private static instance: DeathExplosionManagerCore;
    private pool: DeathExplosionGfx[] = [];
    private poolSize: number = 10;

    //

    private getNewExplosion () : DeathExplosionGfx | null {

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

        const deathExplosion = this.getNewExplosion();
        if ( ! deathExplosion ) return;
        deathExplosion.setActive( position );

    };

    public init () : void {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            const explosion = new DeathExplosionGfx();
            explosion.init();
            this.pool.push( explosion );

        }

    };

    //

    constructor () {

        if ( DeathExplosionManagerCore.instance ) {

            return DeathExplosionManagerCore.instance;

        }

        DeathExplosionManagerCore.instance = this;

    };

};

//

export let DeathExplosionManager = new DeathExplosionManagerCore();
