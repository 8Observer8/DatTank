/*
 * @author ohmed
 * DatTank Player Core
*/

import * as ws from 'ws';

import { Game } from '../Game';
import { ArenaCore } from './Arena.Core';
import { BotCore } from './Bot.Core';
import { TeamCore } from './Team.Core';
import { TankObject } from '../objects/core/Tank.Object';
import { TowerObject } from '../objects/core/Tower.Object';
import { PlayerNetwork } from '../network/Player.Network';

import { GarageManager } from '../managers/Garage.Manager';

//

export class PlayerCore {

    public static Dead: number = 0;
    public static Alive: number = 1;

    private static levelScore = {
        0:      0,
        1:      10,
        2:      30,
        3:      60,
        4:      100,
        5:      150,
        6:      250,
        7:      340,
        8:      500,
        9:      650,
        10:     1000,
        11:     1400,
        12:     1900,
        13:     2500,
        14:     3000,
        15:     3800,
        16:     4500,
        17:     5500,
        18:     6700,
        19:     7200,
        20:     8700,
        21:     9800,
        22:     12000,
    };

    private static numIds = 1;

    //

    public arena: ArenaCore;
    public bot: BotCore;

    public id: number;
    public socket: ws;
    public login: string;
    public status: number;
    public kills: number = 0;
    public death: number = 0;
    public score: number = 0;
    public level: number = 0;
    public bonusLevels = 0;
    public spawnTime: number;
    public tankConfig: object;

    public team: TeamCore;
    public tank: TankObject;
    public network: PlayerNetwork;

    private lastKills: any[] = [];
    private killTimeDist: number = 30000;
    private lastKillSerie: any = { value: null, time: null };

    public readonly type: string = 'Player';

    //

    public checkKillSerie () : boolean {

        let killSerieLength = 0;
        const newKillSerieList = [];
        this.lastKills.push({ time: Date.now(), serie: false });

        for ( let i = this.lastKills.length - 1; i >= 0; i -- ) {

            const index = this.lastKills.length - i - 1;
            if ( Date.now() - this.lastKills[ i ].time <= index * this.killTimeDist ) {

                killSerieLength ++;
                newKillSerieList.push( this.lastKills[ i ] );

            }

        }

        this.lastKills = newKillSerieList;

        if ( this.lastKillSerie.value !== killSerieLength || Date.now() - this.lastKillSerie.time < 60 * 1000 ) {

            for ( let i = 0, il = this.lastKills.length; i < il; i ++ ) {

                if ( this.lastKills[ i ].serie !== false && this.lastKills[ i ].serie >= killSerieLength ) {

                    return false;

                }

            }

            for ( let i = 0, il = this.lastKills.length; i < il; i ++ ) {

                this.lastKills[ i ].serie = killSerieLength;

            }

            this.lastKillSerie.time = Date.now();
            this.lastKillSerie.value = killSerieLength;

            if ( killSerieLength === 2 || killSerieLength === 3 || killSerieLength === 10 ) {

                this.network.killSerie( killSerieLength );

            }

        }

        return true;

    };

    public die ( killer: TankObject | TowerObject ) : void {

        this.lastKills = [];
        this.arena.network.playerDied( this, killer );

    };

    public prepareTank ( tankConfig: any ) : void {

        this.tank = GarageManager.prepareTank( tankConfig, this );
        this.arena.tankManager.add( this.tank );

    };

    public spawn ( tankConfig: object ) : void {

        this.prepareTank( tankConfig );
        this.tank.setRespawnPosition();
        this.arena.updateLeaderboard();

        this.spawnTime = Date.now();

    };

    public respawn ( tankConfig: object ) : void {

        this.bonusLevels = 0;
        this.level = 0;

        this.prepareTank( tankConfig );
        this.tank.setRespawnPosition();
        this.status = PlayerCore.Alive;

        if ( this.socket ) {

            this.changeScore( - Math.floor( 1 * this.score / 3 ) );

        } else {

            if ( Math.random() < 0.35 ) this.changeScore( - Math.floor( 1 * this.score / 6 ) );

        }

        this.arena.updateLeaderboard();
        this.network.confirmRespawn();

        this.spawnTime = Date.now();

    };

    public changeScore ( delta: number ) : void {

        let level = 0;
        this.score += delta;

        while ( PlayerCore.levelScore[ level ] <= this.score ) {

            level ++;

        }

        level --;

        if ( this.level + this.bonusLevels < level || delta < 0 ) {

            if ( delta > 0 ) {

                Game.updateTopList( this.login, this.score, this.kills );

            }

            if ( this.socket ) {

                this.bonusLevels = level - this.level;

                if ( this.bonusLevels > 0 ) {

                    this.network.updateLevel();

                }

            } else if ( this.bot ) {

                this.bot.levelUp();

            }

        }

    };

    public update ( delta: number, time: number ) : void {

        // todo

    };

    public dispose () : void {

        this.network.dispose();
        this.tank.dispose();
        this.arena.tankManager.remove( this.tank.id );

    };

    private getGuestLogin () : string {

        let login = '';
        let loginAttempt = 1;
        const players = this.arena.playerManager.getPlayers();

        while ( ! login ) {

            login = 'player ' + loginAttempt;

            for ( let i = 0, il = players.length; i < il; i ++ ) {

                if ( players[ i ].login === login ) {

                    login = '';
                    loginAttempt ++;
                    break;

                }

            }

        }

        return login;

    };

    public toJSON () : any {

        return {
            id:             this.id,
            login:          this.login,
            team:           this.team.id,
            tank:           this.tank.toJSON(),
        };

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        if ( PlayerCore.numIds > 1000 ) PlayerCore.numIds = 1;
        this.id = PlayerCore.numIds ++;

        this.arena = arena;
        this.network = new PlayerNetwork( this );

        this.login = params.login || this.getGuestLogin();
        this.status = PlayerCore.Alive;
        this.socket = params.socket || null;

        if ( this.socket ) {

            this.socket['player'] = this;
            this.socket['arena'] = arena;

        }

    };

};
