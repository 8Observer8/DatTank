/*
 * @author ohmed
 * Tank Object class
*/

import * as OMath from './../../OMath/Core.OMath';
import { PlayerCore } from './../../core/Player.Core';
import { TeamCore } from '../../core/Team.Core';
import { ArenaCore } from '../../core/Arena.Core';
import { TowerObject } from './Tower.Object';
import { BoxObject } from './Box.Object';
import { TankNetwork } from './../../network/Tank.Network';

import { BaseTankPart } from '../tanks/Base.TankPart';
import { CannonTankPart } from '../tanks/Cannon.TankPart';
import { ArmorTankPart } from '../tanks/Armor.TankPart';
import { EngineTankPart } from '../tanks/Engine.TankPart';

//

export class TankObject {

    private static numIds = 1;
    // private static statsList = [ 'speed', 'rpm', 'armor', 'gun', 'ammoCapacity' ];
    // private static levelStatsChange = {
    //     speed:          [  5,  3,  2,  2,  2,  3,  1,  3,  3,  2,  5,  3,  3,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1 ],
    //     rpm:            [ 30, 20, 20, 15, 10, 15, 20, 20, 30, 40, 30, 20, 10, 10, 20, 30, 20, 10, 20, 20, 20, 10, 15 ],
    //     armor:         [ 40, 30, 20, 20, 30, 40, 50, 20, 30, 50, 30, 20, 10, 10, 20, 20, 30, 20, 10, 15, 20, 10, 10 ],
    //     gun:            [ 20, 15, 15, 20, 15, 10,  5,  5, 10, 15, 20, 30, 35, 40, 20, 10, 15, 15, 20, 10, 10, 10, 30 ],
    //     ammoCapacity:   [ 30, 20, 20, 40, 30, 20,  5,  5, 10, 20, 15, 20, 15, 30, 20, 10, 15, 15, 10, 10, 10, 20, 30 ]
    // };

    //

    public id: number;
    public title: string;
    public team: TeamCore;
    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = Math.random() * Math.PI * 2;
    public radius: number = 25;
    public health: number = 100;
    public ammo: number;
    public viewRange: number = 750;
    public size: OMath.Vec3 = new OMath.Vec3( 30, 25, 70 );

    public moveDirection: OMath.Vec2 = new OMath.Vec2();
    public deltaPosition: OMath.Vec3 = new OMath.Vec3();

    private shootTimeout: any;
    private shootingInterval: any;
    private sinceHitRegenerationLimit: number = 5000;
    private sinceHitTime: number;
    private sinceRegenerationLimit: number = 2000;
    private sinceRegenerationTime: number;

    public base: BaseTankPart;
    public cannon: CannonTankPart;
    public armor: ArmorTankPart;
    public engine: EngineTankPart;

    public inRangeOf: object = {};
    public collisionBox: object;

    public readonly type = 'Tank';
    public player: PlayerCore;
    public arena: ArenaCore;

    public network: TankNetwork;

    //

    public updateStats ( statId: number ) : void {

        // let statName = TankObject.statsList[ statId ];
        // let levelsStats = TankObject.levelStatsChange;
        // let level = this.player.level;
        if ( this.player.bonusLevels <= 0 ) return;

        //

        // switch ( statName ) {

        //     case 'speed':

        //         this.speed += levelsStats['speed'][ level ];
        //         break;

        //     case 'rpm':

        //         this.rpm += levelsStats['rpm'][ level ];
        //         break;

        //     case 'armor':

        //         this.armor += levelsStats['armor'][ level ];
        //         break;

        //     case 'gun':

        //         this.bullet += levelsStats['gun'][ level ];
        //         break;

        //     case 'ammoCapacity':

        //         this.ammoCapacity += levelsStats['ammoCapacity'][ level ];
        //         break;

        //     default:

        //         return;

        // }

        // todo!

        this.player.bonusLevels --;
        this.player.level ++;

    };

    public setRespawnPosition () : void {

        // clear tank from all inRange arrays

        const tanks = this.arena.tankManager.getTanks();
        const towers = this.arena.towerManager.getTowers();

        for ( let i = 0, il = tanks.length; i < il; i ++ ) {

            delete tanks[ i ].inRangeOf[ 'tank-' + this.id ];

        }

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            delete towers[ i ].inRangeOf[ 'tank-' + this.id ];

        }

        //

        const position = new OMath.Vec3( this.team.spawnPosition.x, this.team.spawnPosition.y + 5, this.team.spawnPosition.z );
        const offset = new OMath.Vec3();

        while ( offset.length() < 80 || ! this.arena.collisionManager.isPlaceFree( position.sum( offset ), 100 ) ) {

            offset.x = ( Math.random() - 0.5 ) * 250;
            offset.z = ( Math.random() - 0.5 ) * 250;

        }

        //

        this.position = position.sum( offset );
        this.rotation = Math.random() * Math.PI * 2;

        this.collisionBox['body'].position.set( this.position.x, this.position.y, this.position.z );

    };

    public friendlyFire () : void {

        if ( ! this.player.socket ) return;
        this.network.friendlyFire();

    };

    public hit ( killer: TowerObject | TankObject ) : void {

        if ( this.health <= 0 ) return;
        if ( ! killer ) return;

        //

        const arena = this.player.arena;
        this.sinceHitTime = 0;
        this.sinceRegenerationTime = 0;

        if ( killer.team.id !== this.player.team.id ) {

            if ( killer instanceof TankObject ) {

                this.changeHealth( - 20 * ( 0.3 * Math.random() + 0.7 ) * ( killer.base.cannonCoef * killer.cannon.damage ) / ( this.base.armorCoef * this.armor.armor ), killer );

            } else if ( killer instanceof TowerObject ) {

                this.changeHealth( - 20 * ( 0.3 * Math.random() + 0.7 ) * ( killer.damage ) / ( this.base.armorCoef * this.armor.armor ), killer );

            }

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

    public changeAmmo ( delta: number ) : void {

        if ( this.health <= 0 ) return;

        this.ammo += delta;
        this.ammo = Math.max( Math.min( this.base.ammoCapacity, this.ammo ), 0 );

        //

        this.network.updateAmmo();

    };

    public changeHealth ( delta: number, killer?: TankObject | TowerObject ) : void {

        if ( this.health <= 0 ) return;

        let health = this.health + delta;
        health = Math.max( Math.min( 100, health ), 0 );
        if ( this.health === health ) return;
        this.health = health;

        this.network.updateHealth();

        //

        if ( this.health === 0 ) {

            this.die( killer! );

            if ( killer instanceof PlayerCore ) {

                killer.changeScore( 10 );

            }

        }

    };

    public makeShot () : void {

        if ( this.health <= 0 ) return;
        if ( this.shootTimeout ) return;
        if ( this.ammo <= 0 ) return;

        //

        this.shootTimeout = setTimeout( () => {

            this.shootTimeout = false;

        }, 1000 * 60 / ( this.cannon.rpm * 5 ) );

        // overheating

        if ( this.cannon.temperature >= 80 ) return;
        this.cannon.temperature *= 1.2;
        this.cannon.temperature += 12;
        this.cannon.temperature = Math.min( this.cannon.temperature, 100 );

        //

        const bullet = this.arena.bulletManager.getInactiveBullet();
        if ( ! bullet ) return;

        // compute proper position of bullet

        const position = new OMath.Vec3( this.position.x, 20, this.position.z );
        const offset = 45;
        position.x += offset * Math.cos( Math.PI / 2 - this.rotation );
        position.z += offset * Math.sin( Math.PI / 2 - this.rotation );

        bullet.activate( position, this.rotation, this.cannon.range, this );
        this.ammo --;

        this.network.makeShoot( bullet );

    };

    public startShooting () : void {

        clearInterval( this.shootingInterval );
        this.shootingInterval = setInterval( () => {

            this.makeShot();

        }, 100 );

        this.makeShot();

    };

    public stopShooting () : void {

        clearInterval( this.shootingInterval );

    };

    public setMovement ( directionX: number, directionY: number ) : void {

        if ( this.health <= 0 ) return;
        if ( this.moveDirection.x === directionX && this.moveDirection.y === directionY ) return;

        this.moveDirection.set( directionX, directionY );
        this.network.updateMovement();

    };

    public die ( killer: TankObject | TowerObject ) : void {

        if ( this.player.status !== PlayerCore.Alive ) return;

        this.player.die( killer );

        this.player.status = PlayerCore.Dead;
        this.player.death ++;
        this.team.death ++;
        killer.team.kills ++;

        if ( killer instanceof TankObject ) {

            killer.player.kills ++;
            killer.player.checkKillSerie();

        }

        this.stopShooting();
        this.setMovement( 0, 0 );

        //

        if ( this.player.bot ) {

            this.player.bot.die();

        } else if ( ! this.player.socket ) {

            this.arena.removePlayer( this.player );

        }

        //

        setTimeout( ( tank: TankObject ) => { tank.dispose(); }, 100, this );

    };

    public isObjectInRange ( target: TankObject | TowerObject | BoxObject ) : boolean {

        const distance = this.position.distanceTo( target.position );
        return ( distance < this.viewRange );

    };

    //

    public regenerationUpdate ( delta: number ) : void {

        this.sinceHitTime += delta;

        if ( this.sinceHitTime > this.sinceHitRegenerationLimit ) {

            if ( this.sinceRegenerationTime > this.sinceRegenerationLimit ) {

                this.changeHealth( 2 );
                this.sinceRegenerationTime = 0;

            } else {

                this.sinceRegenerationTime += delta;

            }

        }

    };

    public updateRotation ( delta: number ) : void {

        if ( this.moveDirection.y > 0 ) {

            this.rotation += 0.001 * delta;

        } else if ( this.moveDirection.y < 0 ) {

            this.rotation -= 0.001 * delta;

        }

        this.rotation = this.rotation % ( 2 * Math.PI );
        this.rotation = + this.rotation.toFixed( 3 );

    };

    public updateObjectsInRange () : void {

        const newBoxesInRange: BoxObject[] = [];
        const newTowersInRange: TowerObject[] = [];
        const newTanksInRange: TankObject[] = [];

        const boxes = this.arena.boxManager.getBoxes();
        const tanks = this.arena.tankManager.getTanks();
        const towers = this.arena.towerManager.getTowers();

        // check boxes in range

        for ( let i = 0, il = boxes.length; i < il; i ++ ) {

            const box = boxes[ i ];

            if ( this.isObjectInRange( box ) ) {

                if ( this.inRangeOf[ 'Box-' + box.id ] ) continue;

                this.inRangeOf[ 'Box-' + box.id ] = box;
                newBoxesInRange.push( box );

            } else {

                delete this.inRangeOf[ 'Box-' + box.id ];

            }

        }

        this.network.updateBoxesInRange( newBoxesInRange );

        // check towers in range

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            const tower = towers[ i ];

            if ( this.isObjectInRange( tower ) ) {

                if ( this.inRangeOf[ 'Tower-' + tower.id ] ) continue;

                this.inRangeOf[ 'Tower-' + tower.id ] = tower;
                tower.inRangeOf[ 'Tank-' + this.id ] = this;
                newTowersInRange.push( tower );

            } else {

                delete this.inRangeOf[ 'Tower-' + tower.id ];
                delete tower.inRangeOf[ 'Tank-' + this.id ];

            }

        }

        this.network.updateTowersInRange( newTowersInRange );

        // check tanks in range

        for ( let i = 0, il = tanks.length; i < il; i ++ ) {

            const tank = tanks[ i ];

            if ( this.isObjectInRange( tank ) ) {

                if ( this.inRangeOf[ 'Tank-' + tank.id ] ) continue;

                this.inRangeOf[ 'Tank-' + tank.id ] = tank;
                newTanksInRange.push( tank );

            } else {

                delete this.inRangeOf[ 'Tank-' + tank.id ];

            }

        }

        this.network.updateTanksInRange( newTanksInRange );

    };

    public update ( delta: number, time: number ) : void {

        if ( this.health <= 0 ) return;

        if ( this.cannon.temperature > 0 ) {

            this.cannon.temperature -= 0.2 * delta / 20;

        }

        this.regenerationUpdate( delta );
        this.updateRotation( delta );
        this.updateObjectsInRange();

    };

    public dispose () : void {

        this.network.dispose();
        this.arena.removeObjectFromRangeParams( this );
        this.arena.collisionManager.removeObject( this );
        this.arena.tankManager.remove( this.id );

    };

    public getMaxSpeed () : number {

        return this.engine.maxSpeed * this.base.speedCoef;

    };

    public getEnginePower () : number {

        return this.engine.power;

    };

    public toJSON () : any {

        return {
            id:             this.id,
            health:         this.health,
            ammo:           this.ammo,
            rotation:       this.rotation,
            position:       this.position.toJSON(),
            moveDirection:  this.moveDirection.toJSON(),
            base:           {
                nid:            this.base.nid,
                speedCoef:      this.base.speedCoef,
                cannonCoef:     this.base.speedCoef,
                armorCoef:      this.base.armorCoef,
                ammoCapacity:   this.base.ammoCapacity,
            },
            cannon:         {
                nid:            this.cannon.nid,
                damage:         this.cannon.damage,
                overheating:    this.cannon.overheat,
                range:          this.cannon.range,
            },
            armor:          {
                nid:            this.armor.nid,
                armor:          this.armor.armor,
            },
            engine:         {
                nid:            this.engine.nid,
                maxSpeed:       this.engine.maxSpeed,
                power:          this.engine.power,
            },
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
        this.arena.collisionManager.addObject( this, 'box', true );

    };

};
