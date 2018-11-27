/*
 * @author ohmed
 * DatTank Player Core
*/

import * as ws from 'ws';

import { Master } from './Master.Core';
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

    private static numIds = 1;

    //

    public arena: ArenaCore;
    public bot: BotCore;

    public id: number;
    public socket: ws;
    public login: string;
    public status: number;
    public pid: string;
    public sid: string;

    public coins: number;
    public xp: number;
    public parts: any;

    public kills: number = 0;
    public death: number = 0;
    public score: number = 0;
    public level: number = 0;
    public levelBonuses: number = 0;
    public arenaLevel: number = 0;
    public bonusArenaLevels = 0;

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

    public changeScore ( delta: number ) : void {

        let arenaLevel = 0;
        this.score += delta;

        while ( GarageManager.arenaLevels[ arenaLevel ].score <= this.score ) {

            arenaLevel ++;

        }

        if ( this.arenaLevel + this.bonusArenaLevels < arenaLevel || delta < 0 ) {

            if ( delta > 0 ) {

                Master.updateTopList( this.login, this.score, this.kills, this.death, this.level );

            }

            if ( this.socket ) {

                this.bonusArenaLevels = arenaLevel - this.arenaLevel;

                if ( this.bonusArenaLevels > 0 ) {

                    this.network.updateArenaLevel();

                }

            } else if ( this.bot ) {

                this.bot.levelUp();

            }

        }

    };

    public updateStats ( deltaXP: number, deltaCoins: number ) : void {

        this.xp += deltaXP;
        this.coins += deltaCoins;

        if ( GarageManager.levels[ this.level ] <= this.xp ) {

            this.xp = 0;
            this.level ++;
            this.levelBonuses ++;

        }

        //

        Master.setPlayerStats( this.pid, this.sid, this.xp, this.coins, this.level );
        this.network.updateStats();

    };

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

        this.tank = GarageManager.prepareTank( this.parts, tankConfig, this );
        this.arena.tankManager.add( this.tank );

    };

    public spawn ( tankConfig: object ) : void {

        this.prepareTank( tankConfig );
        this.tank.setRespawnPosition();
        this.arena.updateLeaderboard();

        this.spawnTime = Date.now();

    };

    public respawn ( tankConfig: object ) : void {

        Master.getPlayerInfo( this.pid, this.sid, ( data: any ) => {

            this.xp = data.xp;
            this.coins = data.coins;
            this.pid = data.pid;
            this.sid = data.sid;
            this.parts = data.parts;

            this.bonusArenaLevels = 0;
            this.arenaLevel = 0;

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

        });

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
            xp:             this.xp,
            coins:          this.coins,
        };

    };

    //

    constructor ( arena: ArenaCore, params: any, callback: ( player: PlayerCore ) => void ) {

        if ( PlayerCore.numIds > 1000 ) PlayerCore.numIds = 1;
        this.id = PlayerCore.numIds ++;

        this.arena = arena;
        this.network = new PlayerNetwork( this );

        this.login = params.login || this.getGuestLogin();
        this.status = PlayerCore.Alive;
        this.socket = params.socket || null;

        //

        if ( this.socket ) {

            this.socket['player'] = this;
            this.socket['arena'] = arena;

            Master.getPlayerInfo( params.pid, params.sid, ( data: any ) => {

                this.xp = data.xp;
                this.coins = data.coins;
                this.level = data.level;
                this.levelBonuses = data.levelBonuses;
                this.pid = data.pid;
                this.sid = data.sid;
                this.parts = data.parts;

                callback( this );

            });

        } else {

            callback( this );

        }

    };

};
