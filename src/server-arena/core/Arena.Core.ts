/*
 * @author ohmed
 * DatTank Arena Core
*/

import { PlayerCore } from "./Player.Core";
import { BotCore } from "./Bot.Core";

import { ArenaManager } from "./../managers/Arena.Manager";
import { TeamManager } from "./../managers/Team.Manager";
import { PlayerManager } from "./../managers/Player.Manager";
import { BotManager } from "./../managers/Bot.Manager";
import { TowerManager } from "./../managers/Tower.Manager";
import { DecorationManager } from "./../managers/Decoration.Manager";
import { BoxManager } from "./../managers/Box.Manager";
import { CollisionManager } from "./../managers/Collision.Manager";

//

class ArenaCore {

    private static numIds: number = 0;
    public static NeutralTeam = 1000;

    public id: number;

    public teamManager: TeamManager;
    public playerManager: PlayerManager;
    public botManager: BotManager;
    public towerManager: TowerManager;
    public decorationManager: DecorationManager;
    public boxManager: BoxManager;
    public collisionManager: CollisionManager;

    private updateInterval: any;
    private currentTime: number;
    private prevUpdateTime: number;
    private disposed: boolean = false;
    private leaderboardUpdateTimeout: any;

    private updateRate = 40;

    //

    public addPlayer ( params: any ) {

        // dispose extra bots if needed

        if ( params.socket && ArenaManager.maxPlayersInArena - this.playerManager.getPlayers().length - 2 < 0 ) {

            var bot = this.botManager.getBots()[0];

            if ( bot ) {

                this.botManager.remove( bot );

            }

        }

        //

        var player = new PlayerCore( this, { login: params.login, tank: params.tank, socket: params.socket });
        this.playerManager.add( player );

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
            // this.announce( 'ArenaPlayerLeft', null, { id: player.id } );
    
        }
    
        //
    
        for ( var i = this.playerManager.getPlayers().length; i < this.botManager.botNum; i ++ ) {
    
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

        // todo

    };

    public clear () {

        clearInterval( this.updateInterval );
        this.collisionManager.clear();
    
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
        this.towerManager.update( delta, time );
    
        //
    
        this.collisionManager.update( delta / 3, time );
        this.collisionManager.update( delta / 3, time );
        this.collisionManager.update( delta / 3, time );

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

        this.teamManager = new TeamManager( this );
        this.playerManager = new PlayerManager( this );
        this.botManager = new BotManager( this );
        this.towerManager = new TowerManager( this );
        this.decorationManager = new DecorationManager( this );
        this.boxManager = new BoxManager( this );
        this.collisionManager = new CollisionManager( this );

        this.currentTime = Date.now();
        this.prevUpdateTime = Date.now();

        //

        this.init();

    };

};

//

export { ArenaCore };