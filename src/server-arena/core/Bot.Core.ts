/*
 * @author ohmed
 * DatTank Bot Core
*/

import * as OMath from '../OMath/Core.OMath';
import { ArenaCore } from './Arena.Core';
import { PlayerCore } from './Player.Core';
import { TankObject } from '../objects/core/Tank.Object';
import { TowerObject } from '../objects/core/Tower.Object';

import { UsernameList } from '../utils/UsernameList';

//

enum ACTION { NOTHING = -1, ESCAPE = 0, CHAISE = 1 };

//

export class BotCore {

    private static LoginBase = UsernameList;

    //

    public id: number;
    public player: PlayerCore;
    public removed: boolean = false;
    public login: string;

    public tankConfigs = [
        {
            hull:       'IS2001',
            cannon:     'Plasma-g1',
            armor:      'X-shield',
            engine:     'KX-v8',
        },

        {
            hull:       'TigerS8',
            cannon:     'Plasma-double',
            armor:      'Z8-shield',
            engine:     'KTZ-r2',
        },

        {
            hull:       'OrbitT32s',
            cannon:     'Plasma-triple',
            armor:      'Z8-shield',
            engine:     'VAX-32',
        },

        {
            hull:       'MG813',
            cannon:     'Razer-v2',
            armor:      'KS-shield',
            engine:     'VAX-32s',
        },
        {
            hull:       'MG813',
            cannon:     'Razer-double',
            armor:      'KS-shield',
            engine:     'VAX-32s',
        },

        {
            hull:       'DTEK72',
            cannon:     'Mag87',
            armor:      'MG-defence',
            engine:     'VAX-32',
        },
        {
            hull:       'DTEK72',
            cannon:     'Razer-double',
            armor:      'MG-defence',
            engine:     'VAX-32',
        },

        {
            hull:       'RiperX3',
            cannon:     'Mag87s',
            armor:      'MG-defence',
            engine:     'VAX-32s',
        },
        {
            hull:       'RiperX3',
            cannon:     'Plasma-zero',
            armor:      'MG-defence',
            engine:     'VAX-32s',
        },

    ];

    private target: TankObject | TowerObject | null;
    private action: ACTION;
    private maxKills: number;
    private readonly delayAfterSpawn: number = 2200;

    private arena: ArenaCore;

    //

    public levelUp () : void {

        const statId = Math.floor( Math.random() * 4 );
        this.player.tank.upgrade( statId );

    };

    public die () : void {

        this.player.status = PlayerCore.Dead;
        const players = this.arena.playerManager.getPlayers();
        const bots = this.arena.botManager.getBots();
        const botNum = this.arena.botManager.botNum;

        if ( players.length - bots.length < botNum && this.player.kills < this.maxKills ) {

            setTimeout( this.player.respawn.bind( this.player, this.tankConfigs[ Math.floor( Math.random() * 5 ) ] ), 3000 );

        } else {

            setTimeout( () => {

                if ( this.arena.disposed ) return;
                this.arena.botManager.remove( this );

            }, 2000 );

        }

    };

    private pickLogin () : string {

        let login = '';
        const bots = this.arena.botManager.getBots();

        while ( login === '' ) {

            login = BotCore.LoginBase[ Math.floor( BotCore.LoginBase.length * Math.random() ) ] || '';

            if ( ! login ) {

                for ( let i = 0, il = bots.length; i < il; i ++ ) {

                    if ( login === bots[ i ].login ) {

                        login = '';

                    }

                }

            }

        }

        return login;

    };

    private init () : void {

        this.arena.addPlayer({ login: this.login, tankConfig: this.tankConfigs[ Math.floor( Math.random() * 5 ) ], socket: false }, ( player: PlayerCore ) => {

            this.player = player;
            player.tank.ammo = 10000000;
            player.bot = this;

        });

    };

    private calcTankStrength ( target: TankObject | TowerObject ) : number {

        if ( target.health < 20 ) return 0;

        if ( target instanceof TankObject ) {

            if ( target.ammo < 8 ) return 0;
            return ( target.health * target.cannon.rpm * target.hull.cannonCoef * target.cannon.damage * target.armor.armor );

        } else {

            return target.health * target.rpm * target.damage * target.armor;

        }

    };

    private updateMovement () : void {

        if ( this.player.status === PlayerCore.Dead ) return;
        if ( this.target && this.target.health <= 0 ) this.target = null;

        if ( Math.abs( this.player.tank.position.x ) > 1320 || Math.abs( this.player.tank.position.z ) > 1320 ) {

            this.die();
            return;

        }

        if ( this.action === ACTION.NOTHING ) {

            this.player.tank.setMovement( 0, 0 );

        } else if ( ( this.action === ACTION.ESCAPE || this.action === ACTION.CHAISE ) && this.target ) {

            let dx = this.target.position.x - this.player.tank.position.x;
            let dz = this.target.position.z - this.player.tank.position.z;

            if ( this.action === ACTION.ESCAPE ) {

                dx *= -1;
                dz *= -1;

            }

            const dist = Math.sqrt( dx * dx + dz * dz );
            const angle = OMath.formatAngle( Math.atan2( dx, dz ) );
            const deltaAngle = angle - this.player.tank.rotation;

            //

            const x = ( this.action === ACTION.CHAISE && dist < this.player.tank.cannon.range ) ? 0 : 1;
            let y = ( Math.abs( deltaAngle ) > 0.2 ) ? OMath.sign( deltaAngle ) : 0;

            //

            const viewRange = 40;
            const newPos1 = this.player.tank.position.clone();
            newPos1.x += viewRange * Math.cos( Math.PI / 2 - this.player.tank.rotation );
            newPos1.z += viewRange * Math.sin( Math.PI / 2 - this.player.tank.rotation );

            const newPos2 = this.player.tank.position.clone();
            newPos2.x += 50 * Math.cos( Math.PI / 2 - this.player.tank.rotation );
            newPos2.z += 50 * Math.sin( Math.PI / 2 - this.player.tank.rotation );

            const freeDirection = this.player.arena.collisionManager.isPlaceFree( newPos1, 15, [ this.player.tank.id ], true ) && this.player.arena.collisionManager.isPlaceFree( newPos1, 20, [ this.player.tank.id ], true );
            if ( ! freeDirection ) y = 1;

            //

            this.player.tank.setMovement( x, y );

        }

    };

    private findTask () : void {

        const tanks = this.arena.tankManager.getTanks();
        const towers = this.arena.towerManager.getTowers();
        this.action = ACTION.NOTHING;

        let target = null;
        let minDist = 2000;
        const maxEscapeDist = 500;
        let distance;

        // search for Player target

        for ( let i = 0, il = tanks.length; i < il; i ++ ) {

            const tank = tanks[ i ];

            if ( tank.team.id === this.player.team.id || tank.health <= 0 ) continue;

            distance = tank.position.distanceTo( this.player.tank.position );

            if ( distance <= minDist ) {

                if ( this.calcTankStrength( this.player.tank ) > this.calcTankStrength( tank ) ) {

                    this.action = ACTION.CHAISE;

                } else if ( 1.4 * this.calcTankStrength( this.player.tank ) < this.calcTankStrength( tank ) ) {

                    if ( distance >= maxEscapeDist ) continue;
                    this.action = ACTION.ESCAPE;

                } else {

                    continue;

                }

                minDist = distance;
                target = tank;

            }

        }

        // if ! target search for Tower target

        if ( ! target || minDist > 500 ) {

            minDist = 1500;

            for ( let i = 0, il = towers.length; i < il; i ++ ) {

                const tower = towers[ i ];

                if ( tower.team.id === this.player.team.id ) continue;

                distance = this.player.tank.position.distanceTo( tower.position );

                if ( distance <= minDist ) {

                    if ( this.calcTankStrength( this.player.tank ) > this.calcTankStrength( tower ) ) {

                        this.action = ACTION.CHAISE;

                    } else if ( 1.4 * this.calcTankStrength( this.player.tank ) < this.calcTankStrength( tower ) ) {

                        if ( distance >= maxEscapeDist ) continue;
                        this.action = ACTION.ESCAPE;

                    } else {

                        continue;

                    }

                    minDist = distance;
                    target = tower;

                }

            }

        }

        //

        this.target = target;

        //

        if ( target && minDist < this.player.tank.cannon.range ) {

            const dx = this.player.tank.position.x - target.position.x;
            const dz = this.player.tank.position.z - target.position.z;
            let rotation;
            let deltaAngle;

            rotation = Math.atan2( dx, dz ) + Math.PI / 2 - this.player.tank.rotation;
            deltaAngle = OMath.formatAngle( rotation );
            deltaAngle = ( deltaAngle > Math.PI ) ? deltaAngle - 2 * Math.PI : deltaAngle;
            deltaAngle = ( deltaAngle < - Math.PI ) ? - deltaAngle + 2 * Math.PI : deltaAngle;

            if ( deltaAngle < 0.2 && this.player.tank.cannon.temperature < 0.7 * this.player.tank.cannon.tempLimit ) {

                this.player.tank.cannon.startShooting();

            } else {

                this.player.tank.cannon.stopShooting();

            }

        } else {

            this.player.tank.cannon.stopShooting();

        }

    };

    public update ( delta: number, time: number ) : void {

        if ( this.player.tank.health <= 0 ) return;
        if ( Date.now() - this.player.spawnTime < this.delayAfterSpawn ) return;

        //

        this.updateMovement();
        this.findTask();

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;
        this.maxKills = Math.floor( Math.random() * 60 ) + 8;
        this.login = this.pickLogin();

        this.init();

    };

};
