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

//

export class CannonTankPart {

    public nid: number;

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
        this.shootType = cannonParams.shootType;
        this.shotSpeed = cannonParams.shotSpeed;
        this.overheat = params.overheat;
        this.range = params.range;

    };

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.tank.isMe ) return;

        if ( this.laserShooting ) {

            this.temperature *= 1.01;
            this.temperature += this.overheat * delta / 16;
            this.temperature = Math.min( this.temperature, this.tempLimit );
            UI.InGame.updateOverheat( 100 * this.temperature / this.tempLimit );

        } else if ( this.temperature > 0 ) {

            this.temperature -= 2 * delta / 16;
            UI.InGame.updateOverheat( 100 * this.temperature / this.tempLimit );

        }

    };

    public startShooting () : void {

        this.tank.network.startShooting();

    };

    public stopShooting () : void {

        this.tank.network.stopShooting();

    };

    public makeShot ( shotId: number ) : void {

        if ( this.shootType === 'bullet' ) {

            this.makeBulletShot( shotId );

        } else if ( this.shootType === 'laser' ) {

            this.makeLaserShot( shotId );

        } else if ( this.shootType === 'fire' ) {

            this.makeFireShot();

        } else {

            console.warn( 'Shot type not defined.' );

        }

    };

    public stopShot ( shotId: number ) : void {

        LaserBeamShotManager.hideLaserShot( shotId );
        this.laserShooting = false;

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
            const position = new OMath.Vec3( this.tank.position.x, 20, this.tank.position.z );
            position.x += offset * Math.cos( Math.PI / 2 - this.tank.rotation + this.sourceParam.shootInfo[ i ].dAngle );
            position.z += offset * Math.sin( Math.PI / 2 - this.tank.rotation + this.sourceParam.shootInfo[ i ].dAngle );

            BulletShotManager.showBullet( shotId, position, this.range, this.shotSpeed, Math.PI / 2 - this.tank.rotation );

        }

        this.tank.gfx.shoot();

        if ( this.tank.player.id === Arena.me.id ) {

            Logger.newEvent( 'Shot', 'game' );
            this.tank.setAmmo( this.tank.ammo - 1 );

        }

    };

    private makeLaserShot ( shotId: number ) : void {

        for ( let i = 0, il = this.sourceParam.shootInfo.length; i < il; i ++ ) {

            const offset = new OMath.Vec3();
            offset.x = this.sourceParam.shootInfo[ i ].offset * Math.sin( this.sourceParam.shootInfo[ i ].dAngle );
            offset.y = this.sourceParam.shootInfo[ i ].y;
            offset.z = this.sourceParam.shootInfo[ i ].offset * Math.cos( this.sourceParam.shootInfo[ i ].dAngle );

            LaserBeamShotManager.showLaserShot( shotId, offset, this.range, this.sourceParam.shotSpeed, this.tank );

        }

        this.laserShooting = true;

    };

    private makeFireShot () : void {

        // todo

    };

};
