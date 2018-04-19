/*
 * @author ohmed
 * DatTank Arena bullet manager
*/

import { BulletGfx } from "./../graphics/effects/Bullet.Gfx";
import * as OMath from "./../OMath/Core.OMath";

//

class BulletManagerCore {

    private static instance: BulletManagerCore;
    private pool: Array<BulletGfx> = [];
    private poolSize: number = 30;

    //

    private getNewBullet () : BulletGfx {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].active === false ) {

                return this.pool[ i ];

            }

        }

        return null;

    };

    public update ( time: number, delta: number ) {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            this.pool[ i ].update( time, delta );

        }

    };

    public showBullet ( position: OMath.Vec3, direction: OMath.Vec3 ) {

        let bullet = this.getNewBullet();
        bullet.setActive();

    };

    public init () {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            let bullet = new BulletGfx();
            bullet.init();
            this.pool.push( bullet );

        }

    };

    //

    constructor () {

        if ( BulletManagerCore.instance ) {

            return BulletManagerCore.instance;

        }

        BulletManagerCore.instance = this;

    };

};

//

export let BulletManager = new BulletManagerCore();
