/*
 * @author ohmed
 * DatTank Tank Object class
*/

import * as OMath from "./../../OMath/Core.OMath";

import { Logger } from "./../../utils/Logger";
import { Arena } from "./../../core/Arena.Core";
import { UI } from "./../../ui/Core.UI";
import { PlayerCore } from "./../../core/Player.Core";

import { TankNetwork } from "./../../network/Tank.Network";
import { TankGfx } from "./../../graphics/objects/Tank.Gfx";
import { HealthChangeLabelManager } from "./../../managers/HealthChangeLabel.Manager";
import { BulletManager } from "./../../managers/Bullet.Manager";
import { CollisionManager } from "./../../managers/Collision.Manager";

//

class TankObject {

    public id: number;
    public player: PlayerCore;

    public title: string;
    public year: number;
    public speed: number;
    public ammoCapacity: number;
    public bullet: number;
    public rpm: number;
    public armour: number;

    public overheating: number = -1;
    public health: number;
    public ammo: number;

    public topRotation: number = 0;
    public moveDirection = new OMath.Vec2();
    public positionCorrection = new OMath.Vec3();
    public positionCorrectionDelta = new OMath.Vec3();
    public rotationCorrection: number = 0;
    public acceleration: number = 0;

    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = 0;
    public size: OMath.Vec3 = new OMath.Vec3( 30, 25, 70 );

    public prevForwardVelocity: number = 0;

    protected network: TankNetwork = new TankNetwork();
    protected gfx: TankGfx = new TankGfx();

    public collisionBox: any;
    public readonly type: string = 'Tank';

    //

    public startShooting () {

        this.network.startShooting();

    };

    public stopShooting () {

        this.network.stopShooting();

    };

    public makeShot ( bulletId: number, position: OMath.Vec3, directionRotation: number, overheating: number ) {

        if ( this.health <= 0 ) return;

        if ( Arena.meId === this.player.id ) {

            this.overheating = overheating;
            this.gfx.label.update( this.health, this.armour, this.player.team.color, this.overheating, this.player.username );

        }

        BulletManager.showBullet( bulletId, position, directionRotation );
        this.gfx.shoot();

        if ( this.player.id === Arena.me.id ) {

            Logger.newEvent( 'Shot', 'game' );
            this.setAmmo( this.ammo - 1 );
            UI.InGame.setAmmoReloadAnimation( 60 * 1000 / this.rpm );

        }

    };

    public move ( directionX: number, directionZ: number ) {

        this.network.move( directionX, directionZ );

    };

    public rotateTop ( angle: number ) {

        angle -= this.rotation;
        this.network.rotateTop( angle );

    };

    public die () {

        this.gfx.destroy();

        if ( this.player.id === Arena.me.id ) {

            Logger.newEvent( 'Kill', 'game' );
            GfxCore.addCameraShake( 1000, 1.5 );
            UI.InGame.hideTankStatsUpdate();

        }

    };

    //

    public setMovement ( directionX: number, directionZ: number, positionX: number, positionZ: number, rotation: number ) {

        this.moveDirection.x = directionX;
        this.moveDirection.y = directionZ;

        this.positionCorrection.x = positionX - this.position.x;
        this.positionCorrection.y = 0;
        this.positionCorrection.z = positionZ - this.position.z;

        this.rotationCorrection = rotation / 1000.0 - this.rotation;

    };

    public setTopRotation ( angle: number ) {

        this.topRotation = angle;
        this.gfx.setTopRotation( angle );

    };

    public setAmmo ( value: number ) {

        if ( this.health <= 0 ) return;

        this.ammo = value;

        if ( this.player.id === Arena.me.id ) {

            UI.InGame.updateAmmo( this.ammo );

        }

    };

    public setHealth ( value: number ) {

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
        this.gfx.label.update( this.health, this.armour, this.player.team.color, this.overheating, this.player.username );

        if ( this.health <= 0 ) {

            this.die();

        } else if ( this.health <= 50 ) {

            this.gfx.damageSmoke.show();

        } else {

            this.gfx.damageSmoke.hide();

        }

    };

    public updateMovement ( delta: number ) {

        let dx = this.positionCorrection.x * delta / 300;
        let dz = this.positionCorrection.z * delta / 300;
        let dr = this.rotationCorrection * delta / 100;

        if ( Math.abs( dr ) > 0.001 ) {

            this.rotationCorrection -= dr;
            this.rotation += dr;

        }

        if ( Math.abs( dx ) > 0.1 || Math.abs( dz ) > 0.1 ) {

            this.positionCorrectionDelta.set( dx, 0, dz );

        }

        if ( this.moveDirection.x !== 0 || this.moveDirection.y !== 0 ) {

            this.gfx.toggleMovementSound( true );

            if ( this.moveDirection.y > 0 ) {

                this.rotation += 0.001 * delta;

            } else if ( this.moveDirection.y < 0 ) {

                this.rotation -= 0.001 * delta;

            }

        } else {

            this.gfx.toggleMovementSound( false );

        }

        this.gfx.setPosition( this.position );
        this.gfx.setRotation( this.rotation );
        this.gfx.rotateTankXAxis( this.acceleration );

    };

    public friendlyFire () {

        this.gfx.friendlyFireLabel.show();

    };

    public update ( time: number, delta: number ) {

        this.gfx.update( time, delta );
        if ( this.health <= 0 ) return;

        if ( this.overheating > 0 ) {

            this.overheating -= 0.2 * delta / 16;
            this.gfx.label.update( this.health, this.armour, this.player.team.color, this.overheating, this.player.username );

        }

    };

    public dispose () {

        this.gfx.dispose();
        this.network.dispose();
        CollisionManager.removeObject( this );

    };

    public init () {

        if ( Arena.meId === this.player.id ) {

            this.overheating = 0;

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

    constructor ( params ) {

        this.id = params.id;

        params.position.y += 15;

        this.position.set( params.position.x, params.position.y, params.position.z );
        this.gfx.setPosition( this.position );

        this.health = params.health;
        this.ammo = params.ammo;

        this.rotation = params.rotation;
        this.rotationCorrection = 0;
        this.topRotation = params.rotationTop;

        this.moveDirection.set( params.moveDirection.x, params.moveDirection.y );

    };

};

// get all tanks and put into 'TanksList' object

import { IS2Tank } from "./../../objects/tanks/IS2.Tank";
import { T29Tank } from "./../../objects/tanks/T29.Tank";
import { T44Tank } from "./../../objects/tanks/T44.Tank";
import { T54Tank } from "./../../objects/tanks/T54.Tank";
import { GfxCore } from "./../../graphics/Core.Gfx";

let TankList = {
    IS2:    IS2Tank,
    T29:    T29Tank,
    T44:    T44Tank,
    T54:    T54Tank,
    getById: function ( tankId ) {

        for ( let item in TankList ) {

            if ( TankList[ item ].tid !== undefined ) {

                if ( TankList[ item ].tid === tankId ) {

                    return item;

                }

            }

        }

        return null;

    },
    getList: function () {

        let list = [];

        for ( let item in TankList ) {

            if ( TankList[ item ].tid !== undefined ) {

                list.push( item );

            }

        }

        return list;

    }
};

//

export { TankObject };
export { TankList };
