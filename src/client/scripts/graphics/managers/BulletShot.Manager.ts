/*
 * @author ohmed
 * Arena bullet manager
*/

import { BulletShotGfx } from '../effects/shots/BulletShot.Gfx';
import * as OMath from '../../OMath/Core.OMath';

//

class BulletShotManagerCore {

    private static instance: BulletShotManagerCore;
    private pool: BulletShotGfx[] = [];
    private poolSize: number = 30;

    //

    private getNewBullet () : BulletShotGfx | undefined {

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

    public showBullet ( bulletId: number, position: OMath.Vec3, range: number, directionRotation: number ) : void {

        const bullet = this.getNewBullet();

        if ( bullet ) {

            bullet.setActive( bulletId, position, range, directionRotation );

        }

    };

    public hideBullet ( bulletId: number ) : void {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].id === bulletId ) {

                this.pool[ i ].deactivate();

            }

        }

    };

    public init () : void {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            const bullet = new BulletShotGfx();
            bullet.init();
            this.pool.push( bullet );

        }

    };

    //

    constructor () {

        if ( BulletShotManagerCore.instance ) {

            return BulletShotManagerCore.instance;

        }

        BulletShotManagerCore.instance = this;

    };

};

//

export let BulletShotManager = new BulletShotManagerCore();
