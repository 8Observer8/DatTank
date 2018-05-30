/*
 * @author ohmed
 * DatTank Arena Core
*/

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

        // todo

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
