/*
 * @author ohmed
 * DatTank Arena explosion manager
*/

import { ExplosionGfx } from '../effects/explosions/Explosion.Gfx';
import * as OMath from '../../OMath/Core.OMath';

//

class ExplosionManagerCore {

    private static instance: ExplosionManagerCore;
    private pool: ExplosionGfx[] = [];
    private poolSize: number = 30;

    //

    private getNewExplosion () : ExplosionGfx | undefined {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].active === false ) {

                return this.pool[ i ];

            }

        }

        return undefined;

    };

    public update ( time: number, delta: number ) : void {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            this.pool[ i ].update( time, delta );

        }

    };

    public showExplosion ( position: OMath.Vec3, type: number ) : void {

        const explosion = this.getNewExplosion();
        if ( ! explosion ) return;
        explosion.setActive( position, type );

    };

    public init () : void {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            const explosion = new ExplosionGfx();
            explosion.init();
            this.pool.push( explosion );

        }

    };

    //

    constructor () {

        if ( ExplosionManagerCore.instance ) {

            return ExplosionManagerCore.instance;

        }

        ExplosionManagerCore.instance = this;

    };

};

//

export let ExplosionManager = new ExplosionManagerCore();
