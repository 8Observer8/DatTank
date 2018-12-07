/*
 * @author ohmed
 * Arena laser shot manager
*/

import * as OMath from '../../OMath/Core.OMath';

import { LaserShotGfx } from '../effects/shots/LaserShot.Gfx';
import { TankObject } from '../../objects/core/Tank.Object';

//

class LaserBeamShotManagerCore {

    private static instance: LaserBeamShotManagerCore;
    private pool: LaserShotGfx[] = [];
    private poolSize: number = 30;

    //

    private getNewLaserShot () : LaserShotGfx {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].active === false ) {

                return this.pool[ i ];

            }

        }

        const laserShot = new LaserShotGfx();
        laserShot.init();
        this.pool.push( laserShot );

        return laserShot;

    };

    public update ( time: number, delta: number ) : void {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            this.pool[ i ].update( time, delta );

        }

    };

    public showLaserShot ( shotId: number, offset: OMath.Vec3, range: number, shotSpeed: number, parent: TankObject ) : void {

        const laserShot = this.getNewLaserShot();

        if ( laserShot ) {

            laserShot.setActive( shotId, offset, range, shotSpeed, parent );

        }

    };

    public hideLaserShot ( laserShotId: number ) : void {

        for ( let i = 0, il = this.pool.length; i < il; i ++ ) {

            if ( this.pool[ i ].id === laserShotId ) {

                this.pool[ i ].deactivate();

            }

        }

    };

    public init () : void {

        for ( let i = 0; i < this.poolSize; i ++ ) {

            const laserShot = new LaserShotGfx();
            laserShot.init();
            this.pool.push( laserShot );

        }

    };

    //

    constructor () {

        if ( LaserBeamShotManagerCore.instance ) {

            return LaserBeamShotManagerCore.instance;

        }

        LaserBeamShotManagerCore.instance = this;

    };

};

//

export let LaserBeamShotManager = new LaserBeamShotManagerCore();
