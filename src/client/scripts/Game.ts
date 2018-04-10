/*
 * @author ohmed
 * Game game core & init
*/

import * as $ from 'jquery';

import { Network } from "./network/Core.Network";
import { Garage } from "./garage/Core.Garage";
import { ResourceManager } from "./managers/Resource.Manager";
import { GameService } from "./services/Game.Service";
import { ArenaCore } from "./core/Arena.Core";
import { UICore } from "./ui/Core.UI";

//

class GameCore {

    public version: string = 'v0.6.0';

    public ready: boolean = false;
    public time: number;

    private gameLoopInterval: number;
    private prevLoopTime: number;

    public isMobile: boolean;

    //

    public arena: ArenaCore;

    //

    public ui: UICore = new UICore();
    public garage: Garage = new Garage();
    public network: Network = new Network();
    public resourceManager: ResourceManager = new ResourceManager();
    public gameService: GameService = new GameService();

    //

    public init () {

        var self = this;

        this.network.init();
        this.resourceManager.init();

        this.garage.init( this );

        this.ui.init( this );
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
        this.ready = true;

    };

    public play () {

        this.ui.modules.landing.hide();
        this.garage.hide();
        this.ui.modules.landing.showLoader();
  
        //

        this.resourceManager.load( ( progress ) => {

            this.ui.modules.landing.setLoaderProgress( progress );

        }, function () {

            console.log( 'Loaded' );

        });

    };

    public requestJoinArena () {

        // todo

    };

    public joinArena () {

        // todo

    };

};

//

var game = new GameCore();
window['game'] = game;

$( document ).ready( game.init.bind( game ) );
