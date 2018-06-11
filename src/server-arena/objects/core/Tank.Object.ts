/*
 * @author ohmed
 * Tank Object class
*/

import * as OMath from "./../../OMath/Core.OMath";
import { PlayerCore } from "./../../core/Player.Core";
import { TeamCore } from "../../core/Team.Core";
import { ArenaCore } from "../../core/Arena.Core";
import { TowerObject } from "./Tower.Object";
import { BoxObject } from "./Box.Object";
import { TankNetwork } from "./../../network/Tank.Network";

//

class TankObject {

    private static numIds = 1;
    private static statsList = [ 'speed', 'rpm', 'armour', 'gun', 'ammoCapacity' ];
    private static levelStatsChange = {
        speed:          [  5,  3,  2,  2,  2,  3,  1,  3,  3,  2,  5,  3,  3,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1 ],
        rpm:            [ 30, 20, 20, 15, 10, 15, 20, 20, 30, 40, 30, 20, 10, 10, 20, 30, 20, 10, 20, 20, 20, 10, 15 ],
        armour:         [ 40, 30, 20, 20, 30, 40, 50, 20, 30, 50, 30, 20, 10, 10, 20, 20, 30, 20, 10, 15, 20, 10, 10 ],
        gun:            [ 20, 15, 15, 20, 15, 10,  5,  5, 10, 15, 20, 30, 35, 40, 20, 10, 15, 15, 20, 10, 10, 10, 30 ],
        ammoCapacity:   [ 30, 20, 20, 40, 30, 20,  5,  5, 10, 20, 15, 20, 15, 30, 20, 10, 15, 15, 10, 10, 10, 20, 30 ]
    };

    //

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

    public moveDirection: OMath.Vec2 = new OMath.Vec2();
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

    public updateStats ( statId: number ) {

        let statName = TankObject.statsList[ statId ];
        let levelsStats = TankObject.levelStatsChange;
        let level = this.player.level;
        if ( this.player.bonusLevels <= 0 ) return;

        //

        switch ( statName ) {

            case 'speed':

                this.speed += levelsStats['speed'][ level ];
                this.moveSpeed = this.originalMoveSpeed * this.speed / 40;
                break;

            case 'rpm':

                this.rpm += levelsStats['rpm'][ level ];
                break;

            case 'armour':

                this.armour += levelsStats['armour'][ level ];
                break;

            case 'gun':

                this.bullet += levelsStats['gun'][ level ];
                break;

            case 'ammoCapacity':

                this.ammoCapacity += levelsStats['ammoCapacity'][ level ];
                break;

            default:

                return;

        }

        this.player.bonusLevels --;
        this.player.level ++;

    };

    public setRespawnPosition () {

        // clear tank from all inRange arrays

        let tanks = this.arena.tankManager.getTanks();
        let towers = this.arena.towerManager.getTowers();

        for ( let i = 0, il = tanks.length; i < il; i ++ ) {

            delete tanks[ i ].inRangeOf[ 'tk-' + this.id ];

        }

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            delete towers[ i ].inRangeOf[ 'tk-' + this.id ];

        }

        //

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

    public hit ( killer: TowerObject | TankObject ) {

        if ( this.health <= 0 ) return;
        if ( ! killer ) return;

        //

        let arena = this.player.arena;
        this.sinceHitTime = 0;
        this.sinceRegenerationTime = 0;

        if ( killer.team.id !== this.player.team.id ) {

            this.changeHealth( - 20 * ( killer.bullet / this.armour ) * ( 0.5 * Math.random() + 0.5 ), killer );

        }

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

            this.die( killer );

            if ( killer instanceof PlayerCore ) {

                killer.changeScore( 10 );

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

        bullet.activate( position, this.rotationTop + this.rotation + Math.PI / 2, this );
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
        this.network.updateMovement( this.moveDirection );

    };

    public die ( killer: TankObject | TowerObject ) {

        this.player.die( killer );

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

    public isObjectInRange ( target: TankObject | TowerObject | BoxObject ) {

        let distance = this.position.distanceTo( target.position );
        return ( distance < this.viewRange );

    };

    //

    public regenerationUpdate ( delta: number ) {

        this.sinceHitTime += delta;

        if ( this.sinceHitTime > this.sinceHitRegeneraionLimit ) {

            if ( this.sinceRegenerationTime > this.sinceRegenerationLimit ) {

                this.changeHealth( 2 );
                this.sinceRegenerationTime = 0;

            } else {

                this.sinceRegenerationTime += delta;

            }

        }

    };

    public updatePosition ( delta: number ) {

        if ( this.moveDirection.x !== 0 || this.moveDirection.y !== 0 ) {

            if ( this.moveDirection.x > 0 ) {

                this.deltaPosition.x = + this.moveSpeed * Math.sin( this.rotation ) * delta;
                this.deltaPosition.z = + this.moveSpeed * Math.cos( this.rotation ) * delta;

            } else if ( this.moveDirection.x < 0 ) {

                this.deltaPosition.x = - this.moveSpeed * Math.sin( this.rotation ) * delta;
                this.deltaPosition.z = - this.moveSpeed * Math.cos( this.rotation ) * delta;

            } else {

                this.deltaPosition.x = 0;
                this.deltaPosition.z = 0;

            }

            //

            if ( this.moveDirection.y > 0 ) {

                this.rotation += 0.001 * delta;

            } else if ( this.moveDirection.y < 0 ) {

                this.rotation -= 0.001 * delta;

            }

        }

    };

    public updateObjectsInRange () {

        let newBoxesInRange: Array<BoxObject> = [];
        let newTowersInRange: Array<TowerObject> = [];
        let newTanksInRange: Array<TankObject> = [];

        let boxes = this.arena.boxManager.getBoxes();
        let tanks = this.arena.tankManager.getTanks();
        let towers = this.arena.towerManager.getTowers();

        // check boxes in range

        for ( let i = 0, il = boxes.length; i < il; i ++ ) {

            let box = boxes[ i ];

            if ( this.isObjectInRange( box ) ) {

                if ( this.inRangeOf[ 'b-' + box.id ] ) continue;

                this.inRangeOf[ 'b-' + box.id ] = box;
                newBoxesInRange.push( box );

            } else {

                delete this.inRangeOf[ 'b-' + box.id ];

            }

        }

        this.network.updateBoxesInRange( newBoxesInRange );

        // check towers in range

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            let tower = towers[ i ];

            if ( this.isObjectInRange( tower ) ) {

                if ( this.inRangeOf[ 't-' + tower.id ] ) continue;

                this.inRangeOf[ 't-' + tower.id ] = tower;
                tower.inRangeOf[ 'tk-' + this.id ] = this;
                newTowersInRange.push( tower );

            } else {

                delete this.inRangeOf[ 't-' + tower.id ];
                delete tower.inRangeOf[ 'tk-' + this.id ];

            }

        }

        this.network.updateTowersInRange( newTowersInRange );

        // check tanks in range

        for ( let i = 0, il = tanks.length; i < il; i ++ ) {

            let tank = tanks[ i ];

            if ( this.isObjectInRange( tank ) ) {

                if ( this.inRangeOf[ 'tk-' + tank.id ] ) continue;

                this.inRangeOf[ 'tk-' + tank.id ] = tank;
                newTanksInRange.push( tank );

            } else {

                delete this.inRangeOf[ 'tk-' + tank.id ];

            }

        }

        this.network.updateTanksInRange( newTanksInRange );

    };

    public update ( delta: number, time: number ) {

        if ( this.health <= 0 ) return;

        this.regenerationUpdate( delta );
        this.updatePosition( delta );
        this.updateObjectsInRange();

    };

    public dispose () {

        this.arena.collisionManager.removeObject( this );

    };

    public toJSON () {

        return {
            id:             this.id,
            typeId:         this.typeId,
            health:         this.health,
            ammo:           this.ammo,
            rotation:       this.rotation,
            rotationTop:    this.rotationTop,
            position:       this.position.toJSON(),
            moveDirection:  this.moveDirection.toJSON()
        };

    };

    //

    constructor ( player: PlayerCore ) {

        if ( TankObject.numIds > 1000 ) TankObject.numIds = 1;
        this.id = TankObject.numIds ++;

        this.player = player;
        this.arena = player.arena;
        this.team = player.team;

        this.network = new TankNetwork( this );
        this.arena.collisionManager.addObject( this, 'circle', true );

    };

};

//

export { TankObject };
