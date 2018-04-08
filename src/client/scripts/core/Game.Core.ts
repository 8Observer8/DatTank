/*
 * @author ohmed
 * DatTank game core
*/

import { NetworkManager } from "./../managers/Network.Manager";
import { ResourceManager } from "./../managers/Resource.Manager";

import { GameService } from "./../services/Game.Service";

import { ArenaCore } from "./Arena.Core";
import { UICore } from "./UI.Core";

//

class GameCore {

    public version: string = 'v0.6.0';

    public time: number;

    private gameLoopInterval: number;
    private prevLoopTime: number;

    public isMobile: boolean;

    //

    public arena: ArenaCore;

    //

    public ui: UICore = new UICore();

    public networkManager: NetworkManager = new NetworkManager();
    public resourceManager: ResourceManager = new ResourceManager();

    public gameService: GameService = new GameService();

    //

    public init () {

        var self = this;

        this.networkManager.init();
        this.resourceManager.init();

        this.ui.init();
        this.ui.modules.landing.setVersion( this.version );

        this.arena = new ArenaCore();

        //

        this.gameService.getTopPlayers( this.ui.modules.landing.setTopPlayersBoard.bind( this.ui.modules.landing ) );
        this.gameService.getFreeArena( this.preInitArena.bind( this ) );

        //

        console.log( 'Game [' + this.version + '] inited successfully.' );

    };

    public preInitArena ( server ) {

        this.arena.preInit( server.ip, server.id );
        this.ui.modules.landing.initPlayBtn();

    };

    public requestJoinArena () {

        // todo

    };

    public joinArena () {

        // todo

    };

};

//

export { GameCore };
