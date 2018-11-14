/*
 * @author ohmed
 * DatTank Tank Object class
*/

import * as OMath from '../../OMath/Core.OMath';

import { Logger } from '../../utils/Logger';
import { Arena } from '../../core/Arena.Core';
import { UI } from '../../ui/Core.UI';
import { PlayerCore } from '../../core/Player.Core';

import { BaseTankPart } from '../tanks/Base.TankPart';
import { CannonTankPart } from '../tanks/Cannon.TankPart';
import { ArmorTankPart } from '../tanks/Armor.TankPart';
import { EngineTankPart } from '../tanks/Engine.TankPart';

import { TankNetwork } from '../../network/Tank.Network';
import { TankGfx } from '../../graphics/objects/Tank.Gfx';
import { HealthChangeLabelManager } from '../../managers/HealthChangeLabel.Manager';
import { BulletManager } from '../../managers/Bullet.Manager';
import { CollisionManager } from '../../managers/Collision.Manager';
import { GfxCore } from '../../graphics/Core.Gfx';

//

export class TankObject {

    public id: number;
    public player: PlayerCore;

    public title: string;

    public health: number;
    public ammo: number;

    public base: BaseTankPart;
    public cannon: CannonTankPart;
    public armor: ArmorTankPart;
    public engine: EngineTankPart;

    public moveDirection: OMath.Vec2 = new OMath.Vec2();
    public positionCorrection: OMath.Vec3 = new OMath.Vec3();
    public rotationCorrection: number = 0;
    public rotationCorrectionFixed: number = 0;
    public acceleration: number = 0;
    public velocity: number = 0;

    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = 0;
    public size: OMath.Vec3 = new OMath.Vec3( 30, 25, 70 );

    public posChange: OMath.Vec3 = new OMath.Vec3();
    public rotChange: number = 0;
    public rotChangeCorrect: number = 0;
    public deltaPosChange: number = 0;
    public deltaRotChange: number = 0;

    protected network: TankNetwork = new TankNetwork();
    public gfx: TankGfx = new TankGfx();

    public collisionBox: any;
    public readonly type: string = 'Tank';

    public isMe: boolean = false;

    public possCorrect1: OMath.Vec3 = new OMath.Vec3();
    public possCorrect2: OMath.Vec3 = new OMath.Vec3();
    public rotCorrect1: number = 0;
    public rotCorrect2: number = 0;

    //

    public startShooting () : void {

        this.network.startShooting();

    };

    public stopShooting () : void {

        this.network.stopShooting();

    };

    public makeShot ( bulletId: number, position: OMath.Vec3, directionRotation: number, overheating: number ) : void {

        if ( this.health <= 0 ) return;

        if ( this.isMe ) {

            this.cannon.overheat = overheating;
            this.gfx.label.update( this.health, this.armor.armor, this.player.team.color, this.cannon.overheat, this.player.username, this.isMe );

        }

        BulletManager.showBullet( bulletId, position, this.cannon.range, directionRotation + Math.PI / 2 );
        this.gfx.shoot();

        if ( this.player.id === Arena.me.id ) {

            Logger.newEvent( 'Shot', 'game' );
            this.setAmmo( this.ammo - 1 );
            UI.InGame.setAmmoReloadAnimation( 60 * 1000 / this.cannon.rpm );

        }

    };

    public move ( directionX: number, directionZ: number ) : void {

        this.network.move( directionX, directionZ );

    };

    public die () : void {

        CollisionManager.removeObject( this );

        this.gfx.destroy( () => {

            this.dispose();

        });

        if ( this.player.id === Arena.me.id ) {

            Logger.newEvent( 'Kill', 'game' );
            GfxCore.addCameraShake( 1000, 1.5 );
            UI.InGame.hideTankStatsUpdate();

        }

    };

    //

    public setMovement ( directionX: number, directionZ: number ) : void {

        this.moveDirection.x = directionX;
        this.moveDirection.y = directionZ;

    };

    public setAmmo ( value: number ) : void {

        if ( this.health <= 0 ) return;

        this.ammo = value;

        if ( this.player.id === Arena.me.id ) {

            UI.InGame.updateAmmo( this.ammo );

        }

    };

    public setHealth ( value: number ) : void {

        if ( this.health <= 0 ) return;

        if ( Arena.me.id === this.player.id ) {

            if ( value < this.health ) {

                GfxCore.addCameraShake( 300, 3 );

            }

            UI.InGame.updateHealth( value );

        }

        if ( this.health - value !== 0 ) {

            HealthChangeLabelManager.showHealthChangeLabel( new OMath.Vec3( this.position.x + 5 * ( Math.random() - 0.5 ), this.position.y, this.position.z + 5 * ( Math.random() - 0.5 ) ), value - this.health );

        }

        this.health = value;
        this.gfx.label.update( this.health, this.armor.armor, this.player.team.color, this.cannon.overheat, this.player.username, this.isMe );

        if ( this.health <= 0 ) {

            this.die();

        } else if ( this.health <= 50 ) {

            this.gfx.damageSmoke.show();

        } else {

            this.gfx.damageSmoke.hide();

        }

    };

    public syncState ( positionX: number, positionZ: number, rotation: number ) : void {

        if ( Math.abs( this.position.x - positionX ) > 5 || Math.abs( this.position.z - positionZ ) > 5 ) {

            this.positionCorrection.set( positionX, 0, positionZ );

        }

        let rot = OMath.formatAngle( rotation );
        if ( rot > Math.PI ) rot -= 2 * Math.PI;
        if ( rot < - Math.PI ) rot += 2 * Math.PI;

        if ( Math.abs( rot - this.rotation ) > 0.05 ) {

            this.rotationCorrection = rot;

        }

    };

    public updateMovement ( delta: number, newPosition: OMath.Vec3, newRotation: number ) : void {

        if ( this.moveDirection.x !== 0 || this.moveDirection.y !== 0 ) {

            this.gfx.toggleMovementSound( true );

        } else {

            this.gfx.toggleMovementSound( false );

        }

        //

        this.gfx.rotateTankXAxis( this.acceleration );

        this.rotCorrect2 = OMath.formatAngle( newRotation ) - OMath.formatAngle( this.gfx.object.rotation.y ) - this.rotCorrect1;
        if ( this.rotCorrect2 > Math.PI ) this.rotCorrect2 -= 2 * Math.PI;
        if ( this.rotCorrect2 < - Math.PI ) this.rotCorrect2 += 2 * Math.PI;
        this.rotCorrect2 /= CollisionManager.updateRate;
        this.rotation = newRotation;
        this.deltaRotChange = CollisionManager.updateRate;

        //

        this.possCorrect2.set( newPosition.x - this.gfx.object.position.x - this.possCorrect1.x, newPosition.y - this.gfx.object.position.y, newPosition.z - this.gfx.object.position.z - this.possCorrect1.z );

        this.possCorrect2.x /= CollisionManager.updateRate;
        this.possCorrect2.y /= CollisionManager.updateRate;
        this.possCorrect2.z /= CollisionManager.updateRate;
        this.deltaPosChange = CollisionManager.updateRate;

        this.position.copy( newPosition );

    };

    public friendlyFire () : void {

        this.gfx.friendlyFireLabel.show();

    };

    public update ( time: number, delta: number ) : void {

        this.gfx.update( time, delta );

        if ( this.health <= 0 ) return;

        if ( this.cannon.overheat > 0 ) {

            this.cannon.overheat -= 0.2 * delta / 16;
            this.gfx.label.update( this.health, this.armor.armor, this.player.team.color, this.cannon.overheat, this.player.username, this.isMe );

        }

    };

    public dispose () : void {

        this.gfx.dispose();
        this.network.dispose();
        CollisionManager.removeObject( this );

    };

    public init () : void {

        if ( Arena.meId === this.player.id ) {

            this.cannon.overheat = 0;
            this.isMe = true;

        }

        this.gfx.init( this );
        this.network.init( this );

        if ( this.health <= 50 ) {

            this.gfx.damageSmoke.show();

        }

        if ( this.health <= 0 ) {

            this.gfx.makeTankDestroyed();

        }

        CollisionManager.addObject( this, 'box', true );

    };

    //

    constructor ( params: any ) {

        this.id = params.id;

        this.position.set( params.position.x, params.position.y, params.position.z );
        this.gfx.setPosition( this.position );

        this.health = params.health;
        this.ammo = params.ammo;

        this.base = new BaseTankPart( params.base );
        this.cannon = new CannonTankPart( params.cannon );
        this.armor = new ArmorTankPart( params.armor );
        this.engine = new EngineTankPart( params.engine );

        this.rotation = params.rotation % ( 2 * Math.PI );
        this.rotationCorrection = 0;

        this.moveDirection.set( params.moveDirection.x, params.moveDirection.y );

    };

};
