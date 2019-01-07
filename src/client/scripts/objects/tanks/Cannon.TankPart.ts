/*
 * @author ohmed
 * Tank Cannon part
*/

import * as OMath from '../../OMath/Core.OMath';

import { Game } from '../../Game';
import { Logger } from '../../utils/Logger';
import { Arena } from '../../core/Arena.Core';
import { TankObject } from '../core/Tank.Object';
import { BulletShotManager } from '../../graphics/managers/BulletShot.Manager';
import { LaserBeamShotManager } from '../../graphics/managers/LaserBeamShot.Manager';
import { UI } from '../../ui/Core.UI';
import { GfxCore } from '../../graphics/Core.Gfx';

//

export class CannonTankPart {

    public nid: number;

    public name: string;
    public rpm: number;
    public overheat: number;
    public temperature: number = 0;
    public range: number;
    public shootType: string;
    public shotSpeed: number;
    public sourceParam: any;
    public laserShooting: boolean = false;
    public tempLimit: number = 2300;

    public tank: TankObject;

    private lastShotId: number | null = null;

    //

    constructor ( tank: TankObject, params: any ) {

        this.tank = tank;

        this.nid = params.nid;
        this.rpm = params.rpm;

        let cannonParams;

        for ( const i in Game.GarageConfig.cannon ) {

            if ( Game.GarageConfig.cannon[ i ].nid === params.nid ) {

                cannonParams = Game.GarageConfig.cannon[ i ];
                break;

            }

        }

        this.sourceParam = cannonParams;
        this.name = cannonParams.title;
        this.shootType = cannonParams.shootType;
        this.shotSpeed = cannonParams.shotSpeed;
        this.overheat = params.overheat;
        this.range = params.range;

    };

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.tank.isMe ) return;

        if ( this.laserShooting ) {

            let coef = 1;
            if ( this.temperature > 800 ) coef = 1.5;
            if ( this.temperature > 1400 ) coef = 2;
            if ( this.temperature > 2400 ) coef = 2.5;

            this.temperature += coef * this.overheat * delta / 16;
            this.temperature = Math.min( this.temperature, this.tempLimit );
            UI.InGame.updateOverheat( 100 * this.temperature / this.tempLimit );

        } else if ( this.temperature > 0 ) {

            this.temperature -= 5 * delta / 16;
            this.temperature = Math.max( this.temperature, 0 );
            UI.InGame.updateOverheat( 100 * this.temperature / this.tempLimit );

        }

    };

    public startShooting () : void {

        this.tank.network.startShooting();

    };

    public stopShooting () : void {

        this.tank.network.stopShooting();

    };

    public makeShot ( shotId: number, temperature: number ) : void {

        this.temperature = temperature;

        //

        if ( this.shootType === 'bullet' ) {

            if ( this.tank.isMe ) {

                GfxCore.addCameraShake( 300, 0.3 );

            }

            this.makeBulletShot( shotId );

        } else if ( this.shootType === 'laser' ) {

            this.makeLaserShot( shotId );

        } else {

            console.warn( 'Shot type not defined.' );

        }

    };

    public stopShot ( shotId?: number | null ) : void {

        shotId = shotId || this.lastShotId;
        if ( ! shotId ) return;

        LaserBeamShotManager.hideLaserShot( shotId );
        this.laserShooting = false;
        this.lastShotId = null;

    };

    //

    private makeBulletShot ( shotId: number ) : void {

        if ( this.tank.health <= 0 ) return;

        if ( this.tank.isMe ) {

            this.temperature *= 1.2;
            this.temperature += this.overheat;
            this.temperature = Math.min( this.temperature, this.tempLimit );
            UI.InGame.updateOverheat( 100 * this.temperature / this.tempLimit );

        }

        for ( let i = 0, il = this.sourceParam.shootInfo.length; i < il; i ++ ) {

            const offset = this.sourceParam.shootInfo[ i ].offset;
            const position = new OMath.Vec3( this.tank.position.x, this.sourceParam.shootInfo[ i ].y, this.tank.position.z );
            position.x += offset * Math.cos( Math.PI / 2 - this.tank.rotation + this.sourceParam.shootInfo[ i ].dAngle );
            position.z += offset * Math.sin( Math.PI / 2 - this.tank.rotation + this.sourceParam.shootInfo[ i ].dAngle );

            BulletShotManager.showBullet( this.tank, shotId, position, this.range, this.shotSpeed, Math.PI / 2 - this.tank.rotation );

        }

        this.tank.gfx.shoot();

        if ( this.tank.player.id === Arena.me.id ) {

            Logger.newEvent( 'Shot', 'game' );
            this.tank.setAmmo( this.tank.ammo - this.sourceParam.shootInfo.length );

        }

        this.lastShotId = shotId;

    };

    private makeLaserShot ( shotId: number ) : void {

        this.stopShot();

        for ( let i = 0, il = this.sourceParam.shootInfo.length; i < il; i ++ ) {

            const offset = new OMath.Vec3();
            offset.x = this.sourceParam.shootInfo[ i ].offset * Math.sin( this.sourceParam.shootInfo[ i ].dAngle );
            offset.y = this.sourceParam.shootInfo[ i ].y;
            offset.z = this.sourceParam.shootInfo[ i ].offset * Math.cos( this.sourceParam.shootInfo[ i ].dAngle );

            LaserBeamShotManager.showLaserShot( shotId, offset, this.range, this.sourceParam.shotSpeed, this.tank );

        }

        this.lastShotId = shotId;
        this.laserShooting = true;

    };

};
