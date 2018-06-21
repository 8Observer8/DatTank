/*
 * @author ohmed
 * Game game core & init
*/

import * as $ from "jquery";
import * as MobileDetect from "mobile-detect";

import { Network } from "./network/Core.Network";
import { Garage } from "./garage/Core.Garage";
import { ResourceManager } from "./managers/Resource.Manager";
import { ControlsManager } from "./managers/Control.Manager";
import { SoundManager } from "./managers/Sound.Manager";
import { GameService } from "./services/Game.Service";
import { Arena } from "./core/Arena.Core";
import { UI } from "./ui/Core.UI";
import { Logger } from "./utils/Logger";
import { GfxCore } from "./graphics/Core.Gfx";

import { TowerManager } from "./managers/Tower.Manager";
import { DecorationManager } from "./managers/Decoration.Manager";

//

class GameCore {

    public version: string = 'v0.5.9';
    public isMobile: boolean;
    public ready: boolean = false;

    //

    public garage: Garage = new Garage();
    public gameService: GameService = new GameService();

    private currentServer;

    //

    public init () {

        let mobileDetect = new MobileDetect( window.navigator.userAgent );
        this.isMobile = mobileDetect.mobile() !== null || mobileDetect.phone() !== null || mobileDetect.tablet() !== null;

        //

        ResourceManager.init();

        this.garage.init( this );

        UI.init();
        UI.Landing.setVersion( this.version );
        SoundManager.init();

        //

        this.gameService.getTopPlayers( UI.Landing.setTopPlayersBoard.bind( UI.Landing ) );
        this.gameService.getFreeArena( this.preInitArena.bind( this ) );

        //

        if ( localStorage.getItem('hq') === 'true' || localStorage.getItem('hq') === null ) {

            UI.changeQuality( true, true );

        }

        if ( localStorage.getItem('sound') === 'true' || localStorage.getItem('sound') === null ) {

            UI.changeSound( true, true );

        }

        //

        console.log( 'Game [' + this.version + '] inited successfully.' );

    };

    public preInitArena ( server ) {

        Arena.preInit( server.ip, server.id );
        this.currentServer = server;
        UI.Landing.initPlayBtn();
        this.ready = true;

    };

    public play () {

        this.garage.hide();
        Logger.newEvent( 'Play', 'game' );
        SoundManager.playSound('MenuClick');

        //

        if ( Arena.me ) {

            Arena.me.triggerRespawn();
            return;

        }

        //

        UI.Landing.hide();
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

        Network.init( this.currentServer, () => {

            let login = $('#username').val() || localStorage.getItem('login') || '';
            localStorage.setItem( 'login', login + '' );
            let tank = localStorage.getItem( 'currentTank' ) || 0;

            setTimeout( () => {

                Network.send( 'ArenaJoinRequest', false, { login: login, tank: tank } );

            }, 1000 );

        });

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
window['game']['decorationmanager'] = DecorationManager;
window['game']['resourcemanager'] = ResourceManager;
window['game']['controlsmanager'] = ControlsManager;
