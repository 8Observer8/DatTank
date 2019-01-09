/*
 * @author ohmed
 * Tank Cannon part
*/

import * as OMath from '../../OMath/Core.OMath';
import { TankObject } from '../core/Tank.Object';
import { LaserBeamShotObject } from '../core/LaserBeamShot.Object';
import { BulletShotObject } from '../core/BulletShot.Object';

//

export class CannonTankPart {

    public static shotNumId: number = 1;

    public tank: TankObject;
    public nid: number;
    public title: string;

    public shootType: string;
    public rpm: number;
    public damage: number;
    public overheat: number;
    public range: number;

    public temperature: number;

    private shootTimeout: boolean = false;
    private shootingEnabled: boolean = false;

    private sinceLastShot: number = 0;
    private lastShots: Array< LaserBeamShotObject | BulletShotObject >;
    private shotSpeed: number;

    public tempLimit: number = 2300;
    private tempStopShootingCoef: number = 0.98;

    private sourceParam: any;
    private activeShotId: number | null;

    private shotDuration: number = 0;

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
        this.shotSpeed = params.shotSpeed;

        this.sourceParam = params;

        this.temperature = 0;
        this.lastShots = [];

    };

    //

    public update ( delta: number, time: number ) : void {

        if ( this.shootTimeout && this.sinceLastShot > 1000 * 60 / this.rpm ) {

            this.shootTimeout = false;

        }

        if ( this.shootingEnabled && this.shootType === 'bullet' && ! this.shootTimeout ) {

            this.makeBulletShot();

        }

        if ( this.shootingEnabled && this.shootType === 'laser' && ! this.activeShotId ) {

            this.makeLaserShot();

        }

        //

        if ( this.shootingEnabled && this.shootType !== 'bullet' ) {

            let coef = 1;
            if ( this.temperature > 800 ) coef = 1.5;
            if ( this.temperature > 1400 ) coef = 2;
            if ( this.temperature > 2400 ) coef = 2.5;

            this.temperature += coef * this.overheat * delta / 16;
            this.temperature = Math.min( this.temperature, this.tempLimit );

        } else if ( this.temperature > 0 ) {

            this.temperature -= 5 * delta / 16;
            this.temperature = Math.max( this.temperature, 0 );

        }

        if ( this.shootingEnabled ) {

            if ( this.temperature > this.tempStopShootingCoef * this.tempLimit ) {

                this.stopShooting();

            }

            if ( this.tank.ammo <= 0 ) {

                this.stopShooting();

            }

            if ( this.shootType === 'laser' ) {

                this.shotDuration += delta;

                if ( this.activeShotId && this.shotDuration > 300 ) {

                    this.tank.changeAmmo( - this.sourceParam.shootInfo.length );
                    this.shotDuration = 0;

                }

            }

        }

        this.sinceLastShot += delta;

    };

    public getShotId () : number {

        CannonTankPart.shotNumId = ( CannonTankPart.shotNumId > 1000 ) ? 1 : CannonTankPart.shotNumId + 1;
        return CannonTankPart.shotNumId;

    };

    public startShooting () : void {

        if ( this.temperature > this.tempStopShootingCoef * this.tempLimit ) return;
        if ( this.shootingEnabled ) return;

        this.shootingEnabled = true;

    };

    public stopShooting () : void {

        if ( ! this.shootingEnabled ) return;
        this.shotDuration = 0;
        this.shootingEnabled = false;

        if ( this.shootType !== 'bullet' && this.activeShotId ) {

            for ( let i = 0, il = this.lastShots.length; i < il; i ++ ) {

                this.lastShots[ i ].deactivate();

            }

            this.tank.network.stopShooting( this.activeShotId );

        }

        this.lastShots = [];
        this.activeShotId = null;

    };

    private makeBulletShot () : void {

        if ( this.tank.health <= 0 ) return;
        if ( this.shootTimeout ) return;
        if ( this.tank.ammo <= 0 ) return;

        // overheating

        if ( this.temperature >= 0.8 * this.tempLimit ) return;
        this.temperature *= 1.2;
        this.temperature += this.overheat;
        this.temperature = Math.min( this.temperature, 2300 );

        //

        const shotId = this.getShotId();
        this.lastShots = [];
        this.shootTimeout = true;
        this.sinceLastShot = 0;
        this.shootingEnabled = true;

        for ( let i = 0, il = this.sourceParam.shootInfo.length; i < il; i ++ ) {

            if ( this.tank.ammo <= 0 ) continue;

            const bullet = this.tank.arena.bulletShotManager.getInactiveBullet();
            bullet.shotId = shotId;

            // compute proper position of bullet

            const position = new OMath.Vec3( this.tank.position.x, this.tank.position.y + this.sourceParam.shootInfo[ i ].y, this.tank.position.z );
            const offset = this.sourceParam.shootInfo[ i ].offset;
            position.x += offset * Math.cos( Math.PI / 2 - this.tank.rotation + this.sourceParam.shootInfo[ i ].dAngle );
            position.z += offset * Math.sin( Math.PI / 2 - this.tank.rotation + this.sourceParam.shootInfo[ i ].dAngle );

            bullet.activate( position, this.tank.rotation, this.range, this.shotSpeed, this.tank );
            this.tank.ammo --;
            this.lastShots.push( bullet );

        }

        //

        this.tank.network.makeShoot( shotId );

    };

    private makeLaserShot () : void {

        if ( this.temperature >= this.tempStopShootingCoef * this.tempLimit ) return;
        if ( this.tank.ammo <= 0 ) return;

        this.shootingEnabled = true;
        this.lastShots = [];
        const shotId = this.getShotId();

        for ( let i = 0, il = this.sourceParam.shootInfo.length; i < il; i ++ ) {

            const laserBeam = this.tank.arena.laserBeamShotManager.getInactiveLaserBeam();
            laserBeam.shotId = shotId;
            laserBeam.activate( this.sourceParam.shootInfo[ i ].offset, this.sourceParam.shootInfo[ i ].y, this.sourceParam.shootInfo[ i ].dAngle, this.range, this.shotSpeed, this.tank );
            this.lastShots.push( laserBeam );

        }

        this.activeShotId = shotId;
        this.tank.network.startShooting( shotId );

    };

};
