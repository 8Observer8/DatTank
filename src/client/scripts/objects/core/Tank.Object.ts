/*
 * @author ohmed
 * DatTank Tank Object class
*/

import * as OMath from '../../OMath/Core.OMath';

import { Logger } from '../../utils/Logger';
import { Arena } from '../../core/Arena.Core';
import { UI } from '../../ui/Core.UI';
import { PlayerCore } from '../../core/Player.Core';

import { HullTankPart } from '../tanks/Hull.TankPart';
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

    public hull: HullTankPart;
    public cannon: CannonTankPart;
    public armor: ArmorTankPart;
    public engine: EngineTankPart;

    public moveDirection: OMath.Vec2 = new OMath.Vec2();
    public acceleration: number = 0;
    public velocity: number = 0;
    public directionVelocity: OMath.Vec3 = new OMath.Vec3();
    public angularVelocity: OMath.Vec3 = new OMath.Vec3();

    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = 0;
    public size: OMath.Vec3 = new OMath.Vec3( 30, 25, 60 );

    protected network: TankNetwork = new TankNetwork();
    public gfx: TankGfx = new TankGfx();

    public collisionBox: any;
    public readonly type: string = 'Tank';

    public isMe: boolean = false;

    public stateNeedsCorrect: boolean = false;
    public positionCorrection: OMath.Vec3 = new OMath.Vec3();
    public rotationCorrection: number = 0;
    public positionCorrectValue: OMath.Vec3 = new OMath.Vec3();
    public rotationCorrectValue: number = 0;

    public upgrades = {
        maxSpeed:   0,
        rpm:        0,
        armor:      0,
        cannon:     0,
        power:      0,
    };

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
            UI.InGame.tankUpgradeMenu.hideUpgradeMenu();

        }

    };

    public upgrade ( upgradeType: string ) : void {

        const upgrades = [ 'maxSpeed', 'rpm', 'armor', 'cannon', 'power' ];
        const upgradeId = upgrades.indexOf( upgradeType );

        if ( upgradeId !== -1 ) {

            this.upgrades[ upgradeType ] ++;
            this.network.upgrade( upgradeId );

        }

    };

    //

    public setUpgrade ( maxSpeed: number, power: number, armor: number ) : void {

        this.engine.maxSpeed = maxSpeed;
        this.engine.power = power;
        this.armor.armor = armor;

        this.gfx.label.update( this.health, this.armor.armor, this.player.team.color, this.cannon.overheat, this.player.username, this.isMe );

    };

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

        this.positionCorrection.set( positionX, 0, positionZ );

        rotation = OMath.formatAngle( rotation );
        this.rotationCorrection = rotation;

        this.stateNeedsCorrect = true;

    };

    public updateMovement ( delta: number, velocity: OMath.Vec3, angularVelocity: OMath.Vec3 ) : void {

        if ( this.moveDirection.x !== 0 || this.moveDirection.y !== 0 ) {

            this.gfx.toggleMovementSound( true );

        } else {

            this.gfx.toggleMovementSound( false );

        }

        //

        this.directionVelocity.copy( velocity );
        this.angularVelocity.copy( angularVelocity );

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

        this.hull = new HullTankPart( params.hull );
        this.cannon = new CannonTankPart( params.cannon );
        this.armor = new ArmorTankPart( params.armor );
        this.engine = new EngineTankPart( params.engine );

        this.rotation = params.rotation % ( 2 * Math.PI );
        this.rotationCorrection = 0;

        this.moveDirection.set( params.moveDirection.x, params.moveDirection.y );

    };

};
