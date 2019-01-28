/*
 * @author ohmed
 * Arena bullet cannon shot smoke manager
*/

import * as THREE from 'three';
import * as OMath from '../../OMath/Core.OMath';

import { BulletCannonShotSmoke } from '../effects/smokes/BulletCannonShotSmoke.Gfx';

//

class BulletCannonShotSmokeManagerCore {

    private static instance: BulletCannonShotSmokeManagerCore;
    private pool: BulletCannonShotSmoke[] = [];
    private poolSize: number = 30;

    //

    private getNewShotSmoke () : BulletCannonShotSmoke | undefined {

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

    public showShotSmoke ( position: OMath.Vec3 | THREE.Vector3, rotation: number ) : void {

        const shotSmoke = this.getNewShotSmoke();

        if ( shotSmoke ) {

            shotSmoke.setActive( position, rotation );

        }

    };

    public init () : void {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            const shotSmoke = new BulletCannonShotSmoke();
            shotSmoke.init();
            this.pool.push( shotSmoke );

        }

    };

    //

    constructor () {

        if ( BulletCannonShotSmokeManagerCore.instance ) {

            return BulletCannonShotSmokeManagerCore.instance;

        }

        BulletCannonShotSmokeManagerCore.instance = this;

    };

};

//

export let BulletCannonShotSmokeManager = new BulletCannonShotSmokeManagerCore();
