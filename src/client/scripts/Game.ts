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
import { Controls } from "./core/Controls.Core";
import { UI } from "./ui/Core.UI";
import { Logger } from "./utils/Logger";
import { GfxCore } from "./graphics/Core.Gfx";

import { TowerManager } from "./managers/Tower.Manager";

//

class GameCore {

    public version: string = 'v0.5.1';
    public isMobile: boolean;
    public ready: boolean = false;

    //

    public logger: Logger = new Logger();
    public garage: Garage = new Garage();
    public gameService: GameService = new GameService();

    //

    public init () {

        let mobileDetect = new MobileDetect( window.navigator.userAgent );
        this.isMobile = mobileDetect.mobile() !== null || mobileDetect.phone() !== null || mobileDetect.tablet() !== null;

        //

        ResourceManager.init();

        this.garage.init( this );

        UI.init();
        UI.Landing.setVersion( this.version );

        //

        this.gameService.getTopPlayers( UI.Landing.setTopPlayersBoard.bind( UI.Landing ) );
        this.gameService.getFreeArena( this.preInitArena.bind( this ) );

        //

        console.log( 'Game [' + this.version + '] inited successfully.' );

    };

    public preInitArena ( server ) {

        Arena.preInit( server.ip, server.id );
        UI.Landing.initPlayBtn();
        this.ready = true;

    };

    public play () {

        UI.Landing.hide();
        this.garage.hide();
        UI.Landing.showLoader();
  
        //

        ResourceManager.load( ( progress ) => {

            UI.Landing.setLoaderProgress( progress );

        }, () => {

            UI.Landing.setLoaderLabelToInit();
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
        UI.Landing.hideLoader();
        UI.InGame.showViewport();
        Controls.init();

        GfxCore.init();

    };

    //

    constructor () {

        $( document ).ready( this.init.bind( this ) );

    };

};

//

export let Game = new GameCore();

// for debuging

window['game'] = Game;
window['game']['gfx'] = GfxCore;
window['game']['ui'] = UI;
window['game']['arena'] = Arena;
window['game']['towermanager'] = TowerManager;
