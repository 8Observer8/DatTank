/*
 * @author ohmed
 * Tower Object class
*/

import * as OMath from "./../../OMath/Core.OMath";
import { ArenaCore } from "./../../core/Arena.Core";
import { TeamCore } from "./../../core/Team.Core";
import { PlayerCore } from "./../../core/Player.Core";
import { BulletManager } from "./../../managers/Bullet.Manager";
import { TankObject } from "./../core/Tank.Object";
import { BulletObject } from "./../core/Bullet.Object";
import { TowerNetwork } from "./../../network/Tower.Network";

//

class TowerObject {

    private static numIds = 100;

    public id: number;
    public title: string;
    public team: TeamCore;
    public health: number = 100;
    public size: OMath.Vec3 = new OMath.Vec3( 35, 35, 35 );
    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = 0;
    public newRotation: number = 0;
    public target: TankObject;

    public range: number = 300;
    public armour: number = 230;
    public bullet: number = 120;
    public collisionBox: any;

    public arena: ArenaCore;

    private cooldown = 1300;
    private shootTime: number;
    private bulletsPool: Array<BulletObject> = [];

    private sinceHitRegeneraionLimit: number = 5000;
    private sinceHitTime: number;
    private sinceRegenerationLimit: number = 2000;
    private sinceRegenerationTime: number;

    public inRangeOf: object = {};

    public network: TowerNetwork;
    public readonly type = 'Tower';

    //

    public shoot ( target: TankObject ) {

        let dx = target.position.x - this.position.x;
        let dz = target.position.z - this.position.z;
        let rotation, delta;

        if ( dz === 0 && dx !== 0 ) {

            rotation = ( dx > 0 ) ? - Math.PI : 0;

        } else {

            rotation = - Math.PI / 2 - Math.atan2( dz, dx );

        }

        delta = OMath.formatAngle( rotation ) - OMath.formatAngle( this.rotation );

        if ( Math.abs( delta ) > 0.5 ) return;

        //

        if ( Date.now() - this.shootTime < this.cooldown ) {

            return;

        }

        this.shootTime = Date.now();

        //

        let position = new OMath.Vec3( this.position.x, 20, this.position.z );
        let offset = 45;
        position.x += offset * Math.cos( - this.rotation - Math.PI / 2 );
        position.z += offset * Math.sin( - this.rotation - Math.PI / 2 );

        let bullet = this.arena.bulletManager.getInactiveBullet();
        if ( ! bullet ) return;
        bullet.activate( position, this.rotation + Math.PI, this );

        this.network.makeShot( bullet );

    };

    public changeHealth ( delta: number ) {

        if ( this.health <= 0 ) return;

        let health = this.health + delta;
        health = Math.max( Math.min( 100, health ), 0 );
        if ( this.health === health ) return;
        this.health = health;

        this.network.updateHealth();

    };

    public hit ( killer: TankObject | TowerObject ) {

        if ( ! killer ) return;

        if ( killer instanceof TankObject && killer.team.id === this.team.id ) {

            killer.friendlyFire();
            return;

        }

        //

        this.sinceHitTime = 0;
        this.sinceRegenerationTime = 0;

        this.changeHealth( - 20 * ( killer.bullet / this.armour ) * ( 0.5 * Math.random() + 0.5 ) );

        if ( killer instanceof TankObject ) {
            
            killer.player.changeScore( 1 );
            this.arena.updateLeaderboard();

            //

            if ( this.health === 0 ) {

                this.changeTeam( killer.team, killer.id );
                killer.player.changeScore( 5 );
                // game.updateTopList( killer.login, killer.score, killer.kills );
                this.arena.updateLeaderboard();

            }

        }

    };

    public changeTeam ( team: TeamCore, killerId: number ) {

        team.towers ++;
        this.team.towers --;
        this.team = team;
        this.health = 100;

        this.arena.updateLeaderboard();
        this.network.changeTeam( killerId );

    };

    public getTarget ( players: Array<PlayerCore> ) {

        let dist;
        let target: PlayerCore = null;
        let minDistance = this.range;

        //

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            if ( players[ i ].team.id === this.team.id || players[ i ].tank.health <= 0 ) {

                continue;

            }

            //

            dist = this.position.distanceTo( players[ i ].tank.position );

            if ( dist > this.range ) continue;

            if ( dist < minDistance ) {

                minDistance = dist;
                target = players[ i ];

            }

        }

        //

        return target;

    };

    public rotateTop ( target: TankObject, delta: number ) {

        let dx = target.position.x - this.position.x;
        let dz = target.position.z - this.position.z;
        let newRotation, deltaRot;

        if ( dz === 0 && dx !== 0 ) {

            newRotation = ( dx > 0 ) ? - Math.PI : 0;

        } else {

            newRotation = - Math.PI / 2 - Math.atan2( dz, dx );

        }

        newRotation = OMath.formatAngle( newRotation );

        //

        deltaRot = this.newRotation - this.rotation;

        if ( deltaRot > Math.PI ) {

            if ( delta > 0 ) {

                deltaRot = - 2 * Math.PI + deltaRot;

            } else {

                deltaRot = 2 * Math.PI + deltaRot;

            }

        }

        if ( Math.abs( deltaRot ) > 0.01 ) {

            this.rotation = OMath.formatAngle( this.rotation + Math.sign( deltaRot ) / 30 * ( delta / 50 ) );

        }

        //

        if ( Math.abs( newRotation - this.newRotation ) > 0.15 ) {

            this.newRotation = newRotation;
            this.network.updateTopRotation();

        }

        //

        if ( Date.now() - this.shootTime > this.cooldown && deltaRot < 0.5 ) {

            this.shoot( target );

        }

    };

    public update ( delta: number, time: number ) {

        let target = this.getTarget( this.arena.playerManager.getPlayers() );

        if ( ! target ) {

            this.target = null;

        } else {

            this.target = target.tank;
            this.rotateTop( target.tank, delta );

        }

        this.sinceHitTime += delta;

        if ( this.sinceHitTime > this.sinceHitRegeneraionLimit ) {

            if ( this.sinceRegenerationTime > this.sinceRegenerationLimit ) {

                this.changeHealth( - 5 );
                this.sinceRegenerationTime = 0;

            } else {

                this.sinceRegenerationTime += delta;

            }

        }

    };

    public toJSON () {

        // todo

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        this.arena = arena;

        if ( TowerObject.numIds > 2000 ) TowerObject.numIds = 1000;
        this.id = TowerObject.numIds ++;

        this.team = params.team;
        this.shootTime = Date.now();

        this.position.set( params.position.x, params.position.y, params.position.z );
        this.arena.collisionManager.addObject( this, 'box', false );

        this.network = new TowerNetwork( this );

    };

};

//

export { TowerObject };
