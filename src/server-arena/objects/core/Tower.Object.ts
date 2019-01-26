/*
 * @author ohmed
 * Tower Object class
*/

import * as OMath from '../../OMath/Core.OMath';
import { ArenaCore } from '../../core/Arena.Core';
import { TeamCore } from '../../core/Team.Core';
import { PlayerCore } from '../../core/Player.Core';
import { TankObject } from './Tank.Object';
import { TowerNetwork } from '../../network/Tower.Network';

//

export class TowerObject {

    private static numIds = 100;

    public id: number;
    public title: string;
    public team: TeamCore;
    public health: number = 100;
    public size: OMath.Vec3 = new OMath.Vec3( 50, 80, 50 );
    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = 0;
    public newRotation: number = 0;
    public target: TankObject | null;

    public range: number = 330;
    public armor: number = 50;
    public damage: number = 70;
    private regenerationValue: number = 5;
    public collisionBox: any;

    public arena: ArenaCore;

    public cooldown: number = 2000;
    public rpm: number = 1000 / this.cooldown;
    private shootTime: number;
    public isBase: boolean = false;

    private sinceHitRegenerationLimit: number = 5000;
    private sinceHitTime: number;
    private sinceRegenerationLimit: number = 2000;
    private sinceRegenerationTime: number;

    public inRangeOf: object = {};

    public network: TowerNetwork;
    public readonly type = 'Tower';

    //

    public shoot ( target: TankObject ) : void {

        const dx = target.position.x - this.position.x;
        const dz = target.position.z - this.position.z;
        let rotation;
        let delta;

        if ( dz === 0 && dx !== 0 ) {

            rotation = ( dx > 0 ) ? - Math.PI : 0;

        } else {

            rotation = - Math.PI / 2 - Math.atan2( dz, dx );

        }

        delta = OMath.formatAngle( rotation ) - OMath.formatAngle( this.rotation );

        if ( Math.abs( delta ) > 0.2 ) return;

        //

        if ( Date.now() - this.shootTime < this.cooldown ) {

            return;

        }

        this.shootTime = Date.now();

        //

        const position = new OMath.Vec3( this.position.x, 20, this.position.z );
        const offset = 45;
        position.x += offset * Math.cos( - this.rotation - Math.PI / 2 );
        position.z += offset * Math.sin( - this.rotation - Math.PI / 2 );

        const bullet = this.arena.bulletShotManager.getInactiveBullet();
        if ( ! bullet ) return;
        bullet.activate( position, this.rotation + Math.PI, this.range, 1.8, this );

        this.network.makeShot( bullet );

    };

    public changeHealth ( delta: number ) : void {

        if ( this.health <= 0 && ! this.isBase ) return;

        let health = this.health + delta;
        health = Math.max( Math.min( 100, health ), 0 );
        if ( this.health === health ) return;
        this.health = health;

        this.network.updateHealth();

    };

    public hit ( killer: TankObject | TowerObject ) : void {

        if ( ! killer ) return;

        if ( killer instanceof TankObject && killer.team.id === this.team.id ) {

            killer.friendlyFire();
            return;

        }

        //

        this.sinceHitTime = 0;
        this.sinceRegenerationTime = 0;

        if ( killer instanceof TankObject ) {

            killer.player.changeScore( 1 );
            this.arena.updateLeaderboard();
            this.changeHealth( - 20 * ( 0.3 * Math.random() + 0.7 ) * ( killer.hull.cannonCoef * killer.cannon.damage ) / this.armor );

            //

            if ( this.health === 0 && ! this.isBase ) {

                this.changeTeam( killer.team, killer.player.id );
                killer.player.changeScore( 5 );
                killer.player.updateStats( 10, 0 );
                this.arena.updateLeaderboard();

            }

        }

    };

    public changeTeam ( team: TeamCore | null, killerId?: number ) : void {

        if ( ! team ) return;

        team.towers ++;
        this.team.towers --;
        this.team = team;
        this.health = 100;

        if ( killerId ) {

            this.arena.updateLeaderboard();
            this.network.changeTeam( killerId );

        }

    };

    public getTarget ( players: PlayerCore[] ) : PlayerCore | null {

        let dist;
        let target: PlayerCore | null = null;
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

    public rotateTop ( target: TankObject, delta: number ) : void {

        const dx = target.position.x - this.position.x;
        const dz = target.position.z - this.position.z;
        let newRotation;
        let deltaRot;

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

        if ( Math.abs( deltaRot ) > 0.0001 ) {

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

    public update ( delta: number, time: number ) : void {

        const target = this.getTarget( this.arena.playerManager.getPlayers() );

        if ( ! target ) {

            this.target = null;

        } else if ( target.tank ) {

            this.target = target.tank;
            this.rotateTop( target.tank, delta );

        }

        this.sinceHitTime += delta;

        if ( this.sinceHitTime > this.sinceHitRegenerationLimit || this.isBase ) {

            if ( this.sinceRegenerationTime > this.sinceRegenerationLimit ) {

                this.changeHealth( this.regenerationValue );
                this.sinceRegenerationTime = 0;

            } else {

                this.sinceRegenerationTime += delta;

            }

        }

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        this.arena = arena;

        if ( TowerObject.numIds > 2000 ) TowerObject.numIds = 1000;
        this.id = TowerObject.numIds ++;

        this.team = params.team;
        this.shootTime = Date.now();
        this.sinceHitTime = Date.now();

        this.regenerationValue = ( params.isBase ) ? 40 : 5;
        this.sinceRegenerationLimit = ( params.isBase ) ? 100 : 2000;
        this.isBase = params.isBase;

        this.position.set( params.position.x, params.position.y, params.position.z );
        this.arena.collisionManager.addObject( this, 'box', false );

        this.network = new TowerNetwork( this );

    };

};
