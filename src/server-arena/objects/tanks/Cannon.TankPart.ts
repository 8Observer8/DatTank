/*
 * @author ohmed
 * Tank Cannon part
*/

import * as OMath from '../../OMath/Core.OMath';
import { TankObject } from '../core/Tank.Object';

//

export class CannonTankPart {

    public tank: TankObject;
    public nid: number;
    public title: string;

    public shootType: string;
    public rpm: number;
    public damage: number;
    public overheat: number;
    public range: number;

    public temperature: number;

    private shootTimeout: any;
    private shootingInterval: any;

    private lastShot: any;

    //

    constructor ( tank: TankObject, params: any, level: number ) {

        this.tank = tank;
        this.nid = params.nid;
        this.title = params.title;

        this.shootType = params.shootType;
        this.rpm = params.levels[ level ].rpm;
        this.damage = params.levels[ level ].damage;
        this.overheat = params.levels[ level ].overheat;
        this.range = params.levels[ level ].range;

        this.temperature = 0;

    };

    //

    public startShooting () : void {

        clearInterval( this.shootingInterval );

        if ( this.shootType === 'bullet' ) {

            this.shootingInterval = setInterval( () => {

                this.makeShot();

            }, 100 );

            this.makeShot();

        } else if ( this.shootType === 'laser' ) {

            const laserBeam = this.tank.arena.laserBeamManager.getInactiveLaserBeam();
            this.tank.network.startShooting( laserBeam.id );
            this.lastShot = laserBeam;

        }

    };

    public stopShooting () : void {

        clearInterval( this.shootingInterval );

        if ( this.shootType !== 'bullet' ) {

            this.tank.network.stopShooting( this.lastShot.id );

        }

    };

    public makeShot () : void {

        if ( this.tank.health <= 0 ) return;
        if ( this.shootTimeout ) return;
        if ( this.tank.ammo <= 0 ) return;

        //

        this.shootTimeout = setTimeout( () => {

            this.shootTimeout = false;

        }, 1000 * 60 / this.rpm );

        // overheating

        if ( this.temperature >= 80 ) return;
        this.temperature *= 1.2;
        this.temperature += 12;
        this.temperature = Math.min( this.temperature, 100 );

        //

        const bullet = this.tank.arena.bulletManager.getInactiveBullet();

        // compute proper position of bullet

        const position = new OMath.Vec3( this.tank.position.x, 20, this.tank.position.z );
        const offset = 45;
        position.x += offset * Math.cos( Math.PI / 2 - this.tank.rotation );
        position.z += offset * Math.sin( Math.PI / 2 - this.tank.rotation );

        bullet.activate( position, this.tank.rotation, this.range, this.tank );
        this.tank.ammo --;
        this.lastShot = bullet;

        this.tank.network.makeShoot( bullet );

    };

};
