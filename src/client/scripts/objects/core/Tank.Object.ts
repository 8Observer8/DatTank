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
import { HealthChangeLabelManager } from '../../graphics/managers/HealthChangeLabel.Manager';
import { CollisionManager } from '../../managers/arena/Collision.Manager';
import { GfxCore } from '../../graphics/Core.Gfx';
import { TowerManager } from '../../managers/objects/Tower.Manager';
import { PlayerManager } from '../../managers/arena/Player.Manager';
import { BoxManager } from '../../managers/objects/Box.Manager';

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
    public forwardVelocity: number = 0;
    public directionVelocity: OMath.Vec3 = new OMath.Vec3();
    public angularVelocity: OMath.Vec3 = new OMath.Vec3();

    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = 0;
    public velocityCorrection: OMath.Vec3 = new OMath.Vec3();
    public size: OMath.Vec3 = new OMath.Vec3( 30, 10, 60 );

    public network: TankNetwork = new TankNetwork();
    public gfx: TankGfx = new TankGfx();

    public collisionBox: any;
    public readonly type: string = 'Tank';

    public isMe: boolean = false;
    public readonly viewRange: number = 750;

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

    public move ( directionX: number, directionZ: number ) : void {

        if ( Arena.me && this.player.id === Arena.me.id ) {

            this.setMovement( directionX, directionZ );

        }

        //

        this.network.move( directionX, directionZ );

    };

    public die () : void {

        this.cannon.stopShot();
        CollisionManager.removeObject( this );
        this.gfx.damageSmoke.deactivate();
        this.gfx.shadow.visible = false;
        this.gfx.label.hide();

        this.gfx.destroy( () => {

            this.dispose();

        });

        if ( this.player.id === Arena.me.id ) {

            Logger.newEvent( 'Kill', 'game' );
            GfxCore.addCameraShake( 1000, 0.5 );
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

        if ( ! this.isMe ) {

            this.gfx.label.update( this.health, this.armor.armor, this.player.team.color, this.player.username );

        } else {

            UI.InGame.updateHealth( this.health );

        }

    };

    public setMovement ( directionX: number, directionZ: number ) : void {

        this.moveDirection.x = directionX;
        this.moveDirection.y = directionZ;

    };

    public setAmmo ( value: number ) : void {

        if ( this.health <= 0 ) return;

        this.ammo = Math.max( value, 0 );

        if ( this.player.id === Arena.me.id ) {

            UI.InGame.updateAmmo( this.ammo );

        }

    };

    public setHealth ( value: number ) : void {

        if ( this.health <= 0 ) return;

        if ( Arena.me.id === this.player.id ) {

            if ( value < this.health ) {

                GfxCore.addCameraShake( 300, 2 );

            }

            UI.InGame.updateHealth( value );

        }

        if ( this.health - value > 0 ) {

            HealthChangeLabelManager.showHealthChangeLabel( new OMath.Vec3( this.position.x + 5 * ( Math.random() - 0.5 ), this.position.y, this.position.z + 5 * ( Math.random() - 0.5 ) ), value - this.health );

        }

        this.health = value;

        if ( this.isMe ) {

            UI.InGame.updateHealth( this.health );

        } else {

            this.gfx.label.update( this.health, this.armor.armor, this.player.team.color, this.player.username );

        }

        if ( this.health <= 0 ) {

            this.die();

        } else if ( this.health <= 50 ) {

            this.gfx.damageSmoke.setActive();

        } else {

            this.gfx.damageSmoke.deactivate();

        }

    };

    public syncState ( positionX: number, positionY: number, positionZ: number, rotation: number, velocityX: number, velocityY: number, velocityZ: number ) : void {

        this.velocityCorrection.set( velocityX, velocityY, velocityZ );
        this.positionCorrection.set( positionX, positionY, positionZ );

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

        this.removeObjectsOutOfRange();
        this.gfx.update( time, delta );
        this.cannon.update( time, delta );

    };

    public removeObjectsOutOfRange () : void {

        const towers = TowerManager.get();
        const players = PlayerManager.get();
        const boxes = BoxManager.get();

        const towersToRemove = [];
        const playersToRemove = [];
        const boxesToRemove = [];

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            if ( this.position.distanceTo( towers[ i ].position ) > this.viewRange ) {

                towersToRemove.push( towers[ i ].id );

            }

        }

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            if ( ! players[ i ].tank || this.position.distanceTo( players[ i ].tank!.position ) > this.viewRange ) {

                playersToRemove.push( players[ i ].id );

            }

        }

        for ( let i = 0, il = boxes.length; i < il; i ++ ) {

            if ( this.position.distanceTo( boxes[ i ].position ) > this.viewRange ) {

                boxesToRemove.push( boxes[ i ].id );

            }

        }

    };

    public dispose () : void {

        this.cannon.stopShot();
        this.gfx.dispose();
        this.network.dispose();
        CollisionManager.removeObject( this );

    };

    public init () : void {

        if ( this.health <= 0 ) {

            return;

        }

        if ( Arena.meId === this.player.id ) {

            this.cannon.temperature = 0;
            this.isMe = true;

        }

        this.upgrades.armor = 0;
        this.upgrades.cannon = 0;
        this.upgrades.maxSpeed = 0;
        this.upgrades.power = 0;
        this.upgrades.rpm = 0;

        this.gfx.init( this );
        this.network.init( this );

        if ( this.health <= 50 ) {

            this.gfx.damageSmoke.setActive();

        }

        CollisionManager.addObject( this, 'tank', true );

    };

    //

    constructor ( params: any ) {

        this.id = params.id;

        params.velocity = params.velocity || new OMath.Vec3( 0, 0, 0 );
        this.velocityCorrection.set( params.velocity.x, params.velocity.y, params.velocity.z );
        this.position.set( params.position.x, params.position.y, params.position.z );
        this.gfx.setPosition( this.position );

        this.health = params.health;
        this.ammo = params.ammo;

        this.hull = new HullTankPart( this, params.hull );
        this.cannon = new CannonTankPart( this, params.cannon );
        this.armor = new ArmorTankPart( this, params.armor );
        this.engine = new EngineTankPart( this, params.engine );

        this.rotation = params.rotation % ( 2 * Math.PI );
        this.rotationCorrection = 0;

        this.setMovement( params.moveDirection.x, params.moveDirection.y );

    };

};
