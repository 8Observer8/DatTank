/*
 * @author ohmed
 * DatTank Player Core
*/

import * as ws from "ws";

import { Game } from "./../Game";
import { ArenaCore } from "./Arena.Core";
import { BotCore } from "./Bot.Core";
import { TeamCore } from "./Team.Core";
import { TankObject } from "./../objects/core/Tank.Object";
import { TowerObject } from "./../objects/core/Tower.Object";
import { PlayerNetwork } from "./../network/Player.Network";

import { IS2Tank } from "./../objects/tanks/IS2.Tank";
import { T29Tank } from "./../objects/tanks/T29.Tank";
import { T44Tank } from "./../objects/tanks/T44.Tank";
import { T54Tank } from "./../objects/tanks/T54.Tank";

//

class PlayerCore {

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
        22:     12000
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
    public tankName: string;

    public team: TeamCore;
    public tank: TankObject;
    public network: PlayerNetwork;

    private lastKills: Array<any> = [];
    private killTimeDist: number = 30000;
    private lastKillSerie: any = { value: null, time: null };

    public readonly type: string = 'Player';

    //

    public checkKillSerie () {

        let killSerieLength = 0;
        let newKillSerieList = [];
        this.lastKills.push( Date.now() );

        for ( let i = this.lastKills.length - 1; i >= 0; i -- ) {

            let index = this.lastKills.length - i - 1;
            if ( Date.now() - this.lastKills[ i ] <= index * this.killTimeDist ) {

                killSerieLength ++;
                newKillSerieList.push( this.lastKills[ i ] );

            }

        }

        this.lastKills = newKillSerieList;

        if ( this.lastKillSerie.value !== killSerieLength || Date.now() - this.lastKillSerie.time < 60 * 1000 ) {
        
            this.lastKillSerie.time = Date.now();
            this.lastKillSerie.value = killSerieLength;

            if ( killSerieLength === 2 || killSerieLength === 3 || killSerieLength === 10 ) {
            
                this.network.killSerie( killSerieLength );

            }

        }

    };

    public die ( killer: TankObject | TowerObject ) {

        this.lastKills = [];
        this.arena.network.playerDied( this, killer );

    };

    public selectTank ( tankName: string = 'T29' ) {

        let TanksList = {
            'IS2':    IS2Tank,
            'T29':    T29Tank,
            'T44':    T44Tank,
            'T54':    T54Tank
        };

        if ( ! TanksList[ tankName ] ) {

            tankName = 'T29';

        }

        //

        this.tank = new TanksList[ tankName ]( this );
        this.tank.moveSpeed = this.tank.originalMoveSpeed * this.tank.speed / 40;
        this.tank.ammo = this.tank.ammoCapacity;
        this.arena.tankManager.add( this.tank );

    };

    public spawn ( tankName?: string ) {

        tankName = tankName || 'T44';

        this.selectTank( tankName );
        this.tank.setRespawnPosition();
        this.arena.updateLeaderboard();

    };

    public respawn ( tankName: string ) {

        tankName = tankName || ( this.tank ? this.tank.title : 'T44' );

        this.status = PlayerCore.Alive;
        this.bonusLevels = 0;
        this.level = 0;

        this.tank.dispose();
        this.arena.tankManager.remove( this.tank.id );
        this.selectTank( tankName );
        this.tank.setRespawnPosition();
        this.status = PlayerCore.Alive;

        if ( this.socket ) {

            this.changeScore( - Math.floor( 1 * this.score / 3 ) );

        } else {

            if ( Math.random() < 0.35 ) this.changeScore( - Math.floor( 1 * this.score / 6 ) );

        }

        this.arena.updateLeaderboard();

        this.network.confirmRespawn();

    };

    public changeScore ( delta: number ) {

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
                this.network.updateLevel();

            } else if ( this.bot ) {

                this.bot.levelUp();

            }

        }

    };

    public update ( delta: number, time: number ) {

        // todo

    };

    public dispose () {

        this.network.dispose();
        this.tank.dispose();
        this.arena.tankManager.remove( this.tank.id );

    };

    private getGuestLogin () {

        let login = '';
        let loginAttempt = 1;
        let players = this.arena.playerManager.getPlayers();

        while ( ! login ) {

            login = 'player ' + loginAttempt;

            for ( let i = 0, il = players.length; i < il; i ++ ) {

                if ( players[ i ].login === login ) {

                    login = null;
                    loginAttempt ++;
                    break;

                }

            }

        }

        return login;

    };

    public toJSON () {

        return {
            id:             this.id,
            login:          this.login,
            team:           this.team.id,
            tank:           this.tank.toJSON()
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

        this.tankName = params.tank;

    };

};

//

export { PlayerCore };
