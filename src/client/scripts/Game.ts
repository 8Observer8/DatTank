/*
 * @author ohmed
 * Game game core & init
*/

import * as MobileDetect from 'mobile-detect';

import { Network } from './network/Core.Network';
import { Garage } from './garage/Core.Garage';
import { ResourceManager } from './managers/other/Resource.Manager';
import { SoundManager } from './managers/other/Sound.Manager';
import { GameService } from './services/Game.Service';
import { Arena } from './core/Arena.Core';
import { UI } from './ui/Core.UI';
import { Logger } from './utils/Logger';

import { ControlsManager } from './managers/other/Control.Manager';
import { GfxCore } from './graphics/Core.Gfx';
import { TowerManager } from './managers/objects/Tower.Manager';
import { DecorationManager } from './managers/objects/Decoration.Manager';

//

class GameCore {

    public version: string = 'v0.7.2';
    public isMobile: boolean = false;

    //

    public garage: Garage = new Garage();
    public gameService: GameService = new GameService();

    public GarageConfig: any;

    public pid: string = window['userData'].pid;
    public sid: string = window['userData'].sid;

    public currentServer: any;

    //

    public init () : void {

        if ( location.hash === '#_=_' ) {

            window.history.replaceState( '', document.title, window.location.pathname );

        }

        const mobileDetect = new MobileDetect( window.navigator.userAgent );
        this.isMobile = mobileDetect.mobile() !== null || mobileDetect.phone() !== null || mobileDetect.tablet() !== null;

        if ( this.isMobile ) {

            UI.Landing.showNotSupportInfo();
            return;

        }

        //

        ResourceManager.init();

        this.garage.init();

        UI.init();
        UI.Landing.setVersion( this.version );
        SoundManager.init();

        //

        this.gameService.getTopPlayers( UI.Landing.setTopPlayersBoard.bind( UI.Landing ) );

        //

        if ( localStorage.getItem('hq') === 'true' || localStorage.getItem('hq') === null ) {

            UI.changeQuality( true, true );

        }

        if ( localStorage.getItem('sound') === 'true' || localStorage.getItem('sound') === null ) {

            UI.changeSound( true, true );

        }

        //

        FB.getLoginStatus( ( response ) => {

            if ( response.status === 'connected' ) {

                FB.api( '/' + FB['getUserID']() + '/picture', 'GET', { redirect: 'false' }, ( userData: any ) => {

                    $('.user .userpic').attr( 'src', userData.data.url );

                });

            }

        });

        //

        console.log( 'Game [' + this.version + '] inited successfully.' );

    };

    public play () : void {

        if ( ! this.currentServer ) return;

        this.garage.hide();
        Logger.newEvent( 'Play', 'game' );

        //

        if ( Arena.me ) {

            Arena.me.triggerRespawn();
            return;

        }

        //

        UI.Landing.hide();
        UI.Landing.showLoader();

        //

        ResourceManager.load( ( progress: number ) => {

            UI.Landing.setLoaderProgress( progress );

        }, () => {

            UI.Landing.setLoaderLabelToInit();
            this.requestJoinArena();

        });

    };

    public requestJoinArena () : void {

        Network.init( this.currentServer, () => {

            const login = localStorage.getItem('login') || '';
            const tankConfig = JSON.parse( localStorage.getItem('SelectedParts') || '{}' );

            setTimeout( () => {

                Network.send( 'ArenaJoinRequest', false, { pid: this.pid, sid: this.sid, login, tankConfig } );

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

// for debugging

window['game'] = Game;
window['game']['gfx'] = GfxCore;
window['game']['ui'] = UI;
window['game']['arena'] = Arena;
window['game']['towermanager'] = TowerManager;
window['game']['decorationmanager'] = DecorationManager;
window['game']['resourcemanager'] = ResourceManager;
window['game']['controlsmanager'] = ControlsManager;
window['game']['soundmanager'] = SoundManager;
