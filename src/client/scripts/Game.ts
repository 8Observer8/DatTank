/*
 * @author ohmed
 * Game game core & init
*/

import * as $ from "jquery";
import * as MobileDetect from "mobile-detect";

import { Network } from "./network/Core.Network";
import { Garage } from "./garage/Core.Garage";
import { ResourceManager } from "./managers/Resource.Manager";
import { GameService } from "./services/Game.Service";
import { Arena } from "./core/Arena.Core";
import { UICore } from "./ui/Core.UI";
import { Logger } from "./utils/Logger";
import { GfxCore } from "./graphics/Core.Gfx";

//

class GameCore {

    public version: string = 'v0.5.1';
    public isMobile: boolean;
    public ready: boolean = false;

    //

    public logger: Logger = new Logger();
    public ui: UICore = new UICore();
    public garage: Garage = new Garage();
    public gameService: GameService = new GameService();

    //

    public init () {

        let mobileDetect = new MobileDetect( window.navigator.userAgent );
        this.isMobile = mobileDetect.mobile() !== null || mobileDetect.phone() !== null || mobileDetect.tablet() !== null;

        //

        ResourceManager.init();

        this.garage.init( this );

        this.ui.init( this );
        this.ui.modules.landing.setVersion( this.version );

        //

        this.gameService.getTopPlayers( this.ui.modules.landing.setTopPlayersBoard.bind( this.ui.modules.landing ) );
        this.gameService.getFreeArena( this.preInitArena.bind( this ) );

        //

        console.log( 'Game [' + this.version + '] inited successfully.' );

    };

    public preInitArena ( server ) {

        Arena.preInit( server.ip, server.id );
        this.ui.modules.landing.initPlayBtn();
        this.ready = true;

    };

    public play () {

        this.ui.modules.landing.hide();
        this.garage.hide();
        this.ui.modules.landing.showLoader();
  
        //

        ResourceManager.load( ( progress ) => {

            this.ui.modules.landing.setLoaderProgress( progress );

        }, () => {

            this.ui.modules.landing.setLoaderLabelToInit();
            this.requestJoinArena();

        });

    };

    public requestJoinArena () {

        Network.addMessageListener( 'ArenaJoinResponse', this.joinArena.bind( this ) );

        Network.init( () => {

            let login = $('#username').val() || localStorage.getItem('login') || '';
            localStorage.setItem( 'login', login + '' );
            let tank = localStorage.getItem( 'currentTank' ) || 0;

            setTimeout( () => {

                Network.send( 'ArenaJoinRequest', false, { login: login, tank: tank } );

            }, 1000 );

        });

    };

    public joinArena ( data ) {

        Arena.init( data );
        this.ui.modules.landing.hideLoader();
        this.ui.modules.inGame.showViewport();

        GfxCore.init();

    };

};

//

var game = new GameCore();
window['game'] = game;
window['game']['gfx'] = GfxCore;

$( document ).ready( game.init.bind( game ) );
