/*
 * @author ohmed
 * Tank Object class
*/

import * as OMath from "./../../OMath/Core.OMath";
import { PlayerCore } from "./../../core/Player.Core";
import { TeamCore } from "../../core/Team.Core";
import { ArenaCore } from "../../core/Arena.Core";
import { TowerObject } from "./Tower.Object";
import { TankNetwork } from "./../../network/Tank.Network";

//

class TankObject {

    public id: number;
    public title: string;
    public team: TeamCore;
    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = Math.random() * Math.PI * 2;
    public rotationTop: number = - Math.PI / 2;
    public radius: number = 25;
    public health: number = 100;
    public ammo: number;
    public viewRange: number = 600;

    public range: number = 300;
    public armour: number;
    public bullet: number;
    public speed: number;
    public rpm: number;
    public ammoCapacity: number;

    private moveDirection: OMath.Vec2 = new OMath.Vec2();
    public moveSpeed: number = 0.09;
    public originalMoveSpeed: number = 0.09;

    public deltaPosition: OMath.Vec3 = new OMath.Vec3();

    private shootTimeout: any;
    private shootingInterval: any;
    private sinceHitRegeneraionLimit: number = 5000;
    private sinceHitTime: number;
    private sinceRegenerationLimit: number = 2000;
    private sinceRegenerationTime: number;

    public inRangeOf: object = {};
    public collisionBox: object;

    public readonly type = 'Tank';
    public typeId: number;
    public player: PlayerCore;
    public arena: ArenaCore;

    public network: TankNetwork;

    //

    public setRespawnPosition () {

        let position = new OMath.Vec3( this.team.spawnPosition.x, this.team.spawnPosition.y, this.team.spawnPosition.z );
        let offset = new OMath.Vec3();

        while ( offset.length() < 80 || ! this.arena.collisionManager.isPlaceFree( position.sum( offset ), 50 ) ) {

            offset.x = ( Math.random() - 0.5 ) * 250;
            offset.z = ( Math.random() - 0.5 ) * 250;

        }

        //

        this.position = position.sum( offset );
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationTop = - Math.PI / 2;

        this.collisionBox['body'].position[0] = this.position.x;
        this.collisionBox['body'].position[1] = this.position.z;

    };

    public friendlyFire () {

        if ( ! this.player.socket ) return;
        this.network.friendlyFire();

    };

    public hit ( killerId: number ) {

        if ( this.health <= 0 ) return;

        let arena = this.player.arena;
        let killer = ( killerId < 1000 ) ? arena.tankManager.getById( killerId ) : arena.towerManager.getById( killerId );
        if ( ! killer ) return;

        //

        this.sinceHitTime = 0;
        this.sinceRegenerationTime = 0;

        this.changeHealth( - 20 * ( killer.bullet / this.armour ) * ( 0.5 * Math.random() + 0.5 ), killer );

        if ( killer instanceof TankObject ) {

            if ( killer.team.id === this.player.team.id ) {

                killer.friendlyFire();
                return;

            }

            killer.player.changeScore( 1 );
            arena.updateLeaderboard();

        }

    };

    public changeAmmo ( delta: number ) {

        if ( this.health <= 0 ) return;

        this.ammo += delta;
        this.ammo = Math.max( Math.min( this.ammoCapacity, this.ammo ), 0 );

        //

        this.network.updateAmmo();

    };

    public changeHealth ( delta: number, killer?: TankObject | TowerObject ) {

        if ( this.health <= 0 ) return;

        let health = this.health + delta;
        health = Math.max( Math.min( 100, health ), 0 );
        if ( this.health === health ) return;
        this.health = health;

        this.network.updateHealth();

        //

        if ( this.health === 0 ) {

            // this.die( killer );

            if ( killer instanceof PlayerCore ) {

                killer.changeScore( 10 );
                // game.updateTopList( killer.login, killer.score, killer.kills );

            }

        }

    };

    public setTopRotation ( angle: number ) {

        if ( this.health <= 0 ) return;

        this.rotationTop = angle;
        this.network.updateRotateTop();

    };

    public makeShot () {

        if ( this.health <= 0 ) return;
        if ( this.shootTimeout ) return;
        if ( this.ammo <= 0 ) return;

        //

        this.shootTimeout = setTimeout( () => {

            this.shootTimeout = false;

        }, 1000 * 60 / this.rpm );

        let bullet = this.arena.bulletManager.getInactiveBullet();
        if ( ! bullet ) return;

        // compute proper position of bullet

        let position = new OMath.Vec3( this.position.x, 20, this.position.z );
        let offset = 45;
        position.x += offset * Math.cos( - this.rotationTop - this.rotation );
        position.z += offset * Math.sin( - this.rotationTop - this.rotation );

        bullet.activate( position, this.rotationTop + this.rotation + Math.PI / 2, this.id );
        this.ammo --;

        this.network.makeShoot( bullet );

    };

    public startShooting () {

        this.shootingInterval = setInterval( () => {

            this.makeShot();

        }, 100 );

    };

    public stopShooting () {

        clearInterval( this.shootingInterval );

    };

    public setMovement ( directionX: number, directionY: number ) {

        if ( this.health <= 0 ) return;
        if ( this.moveDirection.x === directionX && this.moveDirection.y === directionY ) return;

        this.moveDirection.set( directionX, directionY );

    };

    public die ( killer: TankObject | TowerObject ) {

        if ( this.health <= 0 ) return;

        this.player.status = PlayerCore.Dead;
        this.player.death ++;
        this.team.death ++;
        killer.team.kills ++;

        if ( killer instanceof TankObject ) {

            killer.player.kills ++;

        }

        this.stopShooting();
        this.setMovement( 0, 0 );

        if ( this.player.bot ) {

            this.player.bot.die();

        } else if ( ! this.player.socket ) {

            this.arena.removePlayer( this.player );

        }

    };

    public isObjectInRange ( target: TankObject | TowerObject ) {

        let distance = this.position.distanceTo( target.position );
        return ( distance < this.viewRange );

    };

    public dispose () {

        this.arena.collisionManager.removeObject( this );

    };

    //

    constructor ( player: PlayerCore ) {

        this.network = new TankNetwork( this );
        this.player = player;
        this.arena = player.arena;
        this.team =  player.team;

        this.arena.collisionManager.addObject( this, 'circle', true );

    };

};

//

export { TankObject };
