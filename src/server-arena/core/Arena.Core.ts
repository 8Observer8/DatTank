/*
 * @author ohmed
 * DatTank Arena Core
*/

import * as OMath from "./../OMath/Core.OMath";
import { PlayerCore } from "./Player.Core";
import { BotCore } from "./Bot.Core";
import { TeamCore } from "./Team.Core";

import { ArenaManager } from "./../managers/Arena.Manager";
import { TeamManager } from "./../managers/Team.Manager";
import { PlayerManager } from "./../managers/Player.Manager";
import { BotManager } from "./../managers/Bot.Manager";
import { TowerManager } from "./../managers/Tower.Manager";
import { DecorationManager } from "./../managers/Decoration.Manager";
import { BoxManager } from "./../managers/Box.Manager";
import { CollisionManager } from "./../managers/Collision.Manager";
import { BulletManager } from "./../managers/Bullet.Manager";
import { TankManager } from "./../managers/Tank.Manager";
import { ArenaNetwork } from "./../network/Arena.Network";

//

class ArenaCore {

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
    private updateRate = 20;

    public network: ArenaNetwork;

    //

    public removeObjectFromRangeParams ( object: any ) {

        let tanks = this.tankManager.getTanks();
        let towers = this.towerManager.getTowers();

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

    public addPlayer ( params: any ) {

        // dispose extra bots if needed

        if ( params.socket && ArenaManager.maxPlayersInArena - this.playerManager.getPlayers().length - 2 < 0 ) {

            let bot = this.botManager.getBots()[0];

            if ( bot ) {

                this.botManager.remove( bot );

            }

        }

        //

        let player = new PlayerCore( this, { login: params.login, socket: params.socket });
        this.playerManager.add( player );
        player.spawn( params.tank );

        //

        if ( ! this.disposed ) {

            this.updateLeaderboard();

        }

        //

        return player;

    };

    public removePlayer ( player: PlayerCore ) {

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

    public updateLeaderboard () {

        function update () {

            if ( this.disposed ) return;

            let players: Array<PlayerCore> = this.playerManager.getPlayers();
            let teams: Array<TeamCore> = this.teamManager.getTeams();
            let towersCount: number = this.towerManager.getTowers().length;
            let playersJSON = [];
            let teamsJSON = [];

            OMath.sortByProperty( players, 'score' );

            for ( let i = 0, il = players.length; i < il; i ++ ) {

                playersJSON.push({
                    id:         this.playerManager.players[ i ].id,
                    login:      this.playerManager.players[ i ].login,
                    team:       this.playerManager.players[ i ].team.id,
                    kills:      this.playerManager.players[ i ].kills,
                    score:      this.playerManager.players[ i ].score
                });

            }

            //

            for ( let i = 0, il = teams.length; i < il; i ++ ) {

                if ( teams[ i ].id === 1000 ) continue;

                teamsJSON.push({
                    id:         teams[ i ].id,
                    score:      Math.floor( 100 * teams[ i ].towers / towersCount )
                });

            }

            //

            this.network.sendEventToAllPlayers( 'ArenaLeaderboardUpdate', null, { players: playersJSON, teams: teamsJSON } );

        };

        //

        clearTimeout( this.leaderboardUpdateTimeout );
        this.leaderboardUpdateTimeout = setTimeout( update.bind( this ), 200 );

    };

    public clear () {

        clearInterval( this.updateInterval );
        this.collisionManager.clear();
        this.network.dispose();

        //

        this.teamManager = null;
        this.playerManager = null;
        this.botManager = null;
        this.towerManager = null;
        this.decorationManager = null;
        this.boxManager = null;
        this.collisionManager = null;

        this.disposed = true;

    };

    private init () {

        this.teamManager.init( 4 );
        this.towerManager.init();
        this.decorationManager.init();
        this.botManager.init();
        this.boxManager.init();

        //

        this.updateInterval = setInterval( this.update.bind( this ), this.updateRate );

    };

    private update () {

        let time = Date.now();
        let delta = time - this.prevUpdateTime;
        this.prevUpdateTime = time;

        // update managers

        this.botManager.update( delta, time );
        this.playerManager.update( delta, time );
        this.tankManager.update( delta, time );
        this.towerManager.update( delta, time );

        //

        this.collisionManager.update( delta, time );

    };

    public toJSON () {

        return {
            id:             this.id,
            decorations:    this.decorationManager.toJSON(),
            teams:          this.teamManager.toJSON(),
            currentTime:    Date.now()
        };

    };

    //

    constructor () {

        if ( ArenaCore.numIds > 1000 ) ArenaCore.numIds = 0;
        this.id = ArenaCore.numIds ++;

        this.network = new ArenaNetwork( this );
        this.tankManager = new TankManager( this );
        this.bulletManager = new BulletManager( this );
        this.teamManager = new TeamManager( this );
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

//

export { ArenaCore };
