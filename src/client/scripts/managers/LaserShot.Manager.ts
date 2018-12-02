/*
 * @author ohmed
 * Arena laser shot manager
*/

import { LaserShotGfx } from '../graphics/effects/LaserShot.Gfx';
import { TankObject } from '../objects/core/Tank.Object';

//

class LaserShotManagerCore {

    private static instance: LaserShotManagerCore;
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

    public showLaserShot ( shotId: number, offset: number, range: number, directionRotation: number, parent: TankObject ) : void {

        const laserShot = this.getNewLaserShot();

        if ( laserShot ) {

            laserShot.setActive( shotId, offset, range, directionRotation, parent );

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

        if ( LaserShotManagerCore.instance ) {

            return LaserShotManagerCore.instance;

        }

        LaserShotManagerCore.instance = this;

    };

};

//

export let LaserShotManager = new LaserShotManagerCore();
