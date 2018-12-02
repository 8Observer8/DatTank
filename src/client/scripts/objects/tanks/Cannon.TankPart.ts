/*
 * @author ohmed
 * Tank Cannon part
*/

import * as OMath from '../../OMath/Core.OMath';

import { Game } from '../../Game';
import { Logger } from '../../utils/Logger';
import { Arena } from '../../core/Arena.Core';
import { TankObject } from '../core/Tank.Object';
import { UI } from '../../ui/Core.UI';
import { BulletManager } from '../../managers/Bullet.Manager';
import { LaserShotManager } from '../../managers/LaserShot.Manager';

//

export class CannonTankPart {

    public nid: number;

    public rpm: number;
    public overheat: number;
    public range: number;
    public shootType: string;
    public sourceParam: any;

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
        this.overheat = params.overheat;
        this.range = params.range;

    };

    //

    public startShooting () : void {

        this.tank.network.startShooting();

    };

    public stopShooting () : void {

        this.tank.network.stopShooting();

    };

    public makeShot ( shotId: number, directionRotation: number, overheating: number ) : void {

        if ( this.shootType === 'bullet' ) {

            this.makeBulletShot( shotId, directionRotation, overheating );

        } else if ( this.shootType === 'laser' ) {

            this.makeLaserShot( shotId, directionRotation, overheating );

        } else if ( this.shootType === 'fire' ) {

            this.makeFireShot();

        } else {

            console.warn( 'Shot type not defined.' );

        }

    };

    public stopShot ( shotId: number ) : void {

        LaserShotManager.hideLaserShot( shotId );

    };

    //

    private makeBulletShot ( shotId: number, directionRotation: number, overheating: number ) : void {

        if ( this.tank.health <= 0 ) return;

        if ( this.tank.isMe ) {

            this.overheat = overheating;
            this.tank.gfx.label.update( this.tank.health, this.tank.armor.armor, this.tank.player.team.color, this.overheat, this.tank.player.username, this.tank.isMe );

        }

        for ( let i = 0, il = this.sourceParam.shootInfo.length; i < il; i ++ ) {

            const offset = this.sourceParam.shootInfo[ i ].offset;
            const position = new OMath.Vec3( this.tank.position.x, 20, this.tank.position.z );
            position.x += offset * Math.cos( Math.PI / 2 - this.tank.rotation + this.sourceParam.shootInfo[ i ].dAngle );
            position.z += offset * Math.sin( Math.PI / 2 - this.tank.rotation + this.sourceParam.shootInfo[ i ].dAngle );

            BulletManager.showBullet( shotId, position, this.range, directionRotation + Math.PI / 2 );

        }

        this.tank.gfx.shoot();

        if ( this.tank.player.id === Arena.me.id ) {

            Logger.newEvent( 'Shot', 'game' );
            this.tank.setAmmo( this.tank.ammo - 1 );
            UI.InGame.setAmmoReloadAnimation( 60 * 1000 / this.rpm );

        }

    };

    private makeLaserShot ( shotId: number, directionRotation: number, overheating: number ) : void {

        LaserShotManager.showLaserShot( shotId, this.sourceParam.shootInfo[0].offset, this.range, directionRotation, this.tank );

    };

    private makeFireShot () : void {

        // todo

    };

};
