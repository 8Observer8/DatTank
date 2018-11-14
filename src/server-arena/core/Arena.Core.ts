/*
 * @author ohmed
 * DatTank Arena Core
*/

import * as OMath from './../OMath/Core.OMath';
import { PlayerCore } from './Player.Core';
import { BotCore } from './Bot.Core';
import { TeamCore } from './Team.Core';

import { ArenaManager } from '../managers/Arena.Manager';
import { TeamManager } from '../managers/Team.Manager';
import { PlayerManager } from '../managers/Player.Manager';
import { BotManager } from '../managers/Bot.Manager';
import { TowerManager } from '../managers/Tower.Manager';
import { DecorationManager } from '../managers/Decoration.Manager';
import { BoxManager } from '../managers/Box.Manager';
import { CollisionManager } from '../managers/Collision.Manager';
import { BulletManager } from '../managers/Bullet.Manager';
import { TankManager } from '../managers/Tank.Manager';
import { ArenaNetwork } from '../network/Arena.Network';

//

export class ArenaCore {

    private static numIds: number = 0;
    public static NeutralTeam = 1000;

    public id: number;

    public bulletManager: BulletManager;
    public teamManager: TeamManager;
    public tankManager: TankManager;
    public playerManager: PlayerManager;
    public botManager: BotManager;
    public towerManager: TowerManager;
    public decorationManager: DecorationManager;
    public boxManager: BoxManager;
    public collisionManager: CollisionManager;

    public disposed: boolean = false;

    private updateInterval: any;
    private prevUpdateTime: number;
    private leaderboardUpdateTimeout: any;
    private updateRate = 50;

    public network: ArenaNetwork;

    //

    public removeObjectFromRangeParams ( object: any ) : any {

        const tanks = this.tankManager.getTanks();
        const towers = this.towerManager.getTowers();

        for ( let i = 0, il = tanks.length; i < il; i ++ ) {

            if ( tanks[ i ].inRangeOf[ object.type + '-' + object.id ] ) {

                delete tanks[ i ].inRangeOf[ object.type + '-' + object.id ];

            }

        }

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            if ( towers[ i ].inRangeOf[ object.type + '-' + object.id ] ) {

                delete towers[ i ].inRangeOf[ object.type + '-' + object.id ];

            }

        }

    };

    public addPlayer ( params: any, callback: ( player: PlayerCore ) => void ) : PlayerCore {

        // dispose extra bots if needed

        if ( params.socket && ArenaManager.maxPlayersInArena - this.playerManager.getPlayers().length - 2 < 0 ) {

            const bot = this.botManager.getBots()[0];

            if ( bot ) {

                this.botManager.remove( bot );

            }

        }

        //

        const player = new PlayerCore( this, {
            pid: params.pid,
            sid: params.sid,
            login: params.login,
            socket: params.socket,
        }, ( createdPlayer: PlayerCore ) => {

            this.playerManager.add( createdPlayer );
            createdPlayer.spawn( params.tankConfig );

            //

            if ( ! this.disposed ) {

                this.updateLeaderboard();

            }

            //

            callback( createdPlayer );

        });

        return player;

    };

    public removePlayer ( player: PlayerCore ) : void {

        if ( this.playerManager.remove( player.id ) ) {

            player.team.removePlayer( player.id );
            player.dispose();
            this.network.playerLeft( player );

        }

        //

        for ( let i = this.playerManager.getPlayers().length; i < this.botManager.botNum; i ++ ) {

            this.botManager.add( new BotCore( this ) );

        }

        //

        if ( player.socket ) {

            ArenaManager.removeEmptyArenas();

        }

        //

        if ( ! this.disposed ) {

            this.updateLeaderboard();

        }

    };

    public updateLeaderboard () : void {

        const update = () => {

            if ( this.disposed ) return;

            const players: PlayerCore[] = this.playerManager.getPlayers();
            const teams: TeamCore[] = this.teamManager.getTeams();
            const towersCount: number = this.towerManager.getTowers().length;
            const playersJSON = [];
            const teamsJSON = [];

            OMath.sortByProperty( players, 'score' );

            for ( let i = 0, il = players.length; i < il; i ++ ) {

                playersJSON.push({
                    id:         players[ i ].id,
                    login:      players[ i ].login,
                    team:       players[ i ].team.id,
                    kills:      players[ i ].kills,
                    score:      players[ i ].score,
                });

            }

            //

            for ( let i = 0, il = teams.length; i < il; i ++ ) {

                if ( teams[ i ].id === 1000 ) continue;

                teamsJSON.push({
                    id:         teams[ i ].id,
                    score:      Math.floor( 100 * teams[ i ].towers / towersCount ),
                });

            }

            //

            this.network.sendEventToAllPlayers( 'ArenaLeaderboardUpdate', null, { players: playersJSON, teams: teamsJSON } );

        };

        //

        clearTimeout( this.leaderboardUpdateTimeout );
        this.leaderboardUpdateTimeout = setTimeout( update.bind( this ), 200 );

    };

    public clear () : void {

        clearInterval( this.updateInterval );
        this.collisionManager.clear();
        this.network.dispose();

        //

        this.disposed = true;

    };

    private init () : void {

        this.teamManager.init( 4 );
        this.towerManager.init();
        this.decorationManager.init();
        this.botManager.init();
        this.boxManager.init();

        //

        this.updateInterval = setInterval( this.update.bind( this ), this.updateRate );

    };

    private update () : void {

        const time = Date.now();
        this.prevUpdateTime = this.prevUpdateTime || time;
        const delta = time - this.prevUpdateTime;
        this.prevUpdateTime = time;

        // update managers

        this.botManager.update( delta, time );
        this.playerManager.update( delta, time );
        this.tankManager.update( delta, time );
        this.towerManager.update( delta, time );

        //

        this.collisionManager.update( delta, time );

    };

    public toJSON () : any {

        return {
            id:             this.id,
            decorations:    this.decorationManager.toJSON(),
            teams:          this.teamManager.toJSON(),
            currentTime:    Date.now(),
        };

    };

    //

    constructor () {

        if ( ArenaCore.numIds > 1000 ) ArenaCore.numIds = 0;
        this.id = ArenaCore.numIds ++;

        this.network = new ArenaNetwork( this );
        this.tankManager = new TankManager( this );
        this.bulletManager = new BulletManager( this );
        this.teamManager = new TeamManager();
        this.playerManager = new PlayerManager( this );
        this.botManager = new BotManager( this );
        this.towerManager = new TowerManager( this );
        this.decorationManager = new DecorationManager( this );
        this.boxManager = new BoxManager( this );
        this.collisionManager = new CollisionManager( this );

        this.prevUpdateTime = Date.now();

        //

        this.init();

    };

};
