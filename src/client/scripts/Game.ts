/*
 * @author ohmed
 * Game game core & init
*/

import { Network } from './network/Core.Network';
import { Garage } from './garage/Core.Garage';
import { ResourceManager } from './managers/Resource.Manager';
import { SoundManager } from './managers/Sound.Manager';
import { GameService } from './services/Game.Service';
import { Arena } from './core/Arena.Core';
import { UI } from './ui/Core.UI';
import { Logger } from './utils/Logger';

import { ControlsManager } from './managers/Control.Manager';
import { GfxCore } from './graphics/Core.Gfx';
import { TowerManager } from './managers/Tower.Manager';
import { DecorationManager } from './managers/Decoration.Manager';

//

class GameCore {

    public version: string = 'v0.7.0';
    public isMobile: boolean;
    public ready: boolean = false;

    //

    public garage: Garage = new Garage();
    public gameService: GameService = new GameService();

    public pid: string = window['userData'].pid;
    public sid: string = window['userData'].sid;

    private currentServer: any;

    //

    public init () : void {

        if ( location.hash === '#_=_' ) {

            window.history.replaceState( '', document.title, window.location.pathname );

        }

        // let mobileDetect = new MobileDetect( window.navigator.userAgent );
        this.isMobile = false; // mobileDetect.mobile() !== null || mobileDetect.phone() !== null || mobileDetect.tablet() !== null;

        //

        ResourceManager.init();

        this.garage.init();

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

    public preInitArena ( server: any ) : void {

        if ( server.error === 1 ) {

            UI.Landing.noArenaAvailable();

        } else {

            Arena.preInit( server.ip, server.id );
            this.currentServer = server;
            UI.Landing.initPlayBtn();
            this.ready = true;

        }

    };

    public play () : void {

        if ( ! this.currentServer ) return;

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

        ResourceManager.load( ( progress: number ) => {

            UI.Landing.setLoaderProgress( progress );

        }, () => {

            UI.Landing.setLoaderLabelToInit();
            this.requestJoinArena();

        });

    };

    public requestJoinArena () : void {

        Network.init( this.currentServer, () => {

            const login = $('#username').val() || localStorage.getItem('login') || '';
            localStorage.setItem( 'login', login + '' );

            const tankConfig = {
                tank:       localStorage.getItem( 'SelectedTank' ) || '',
                cannon:     localStorage.getItem( 'SelectedCannon' ) || '',
                armor:      localStorage.getItem( 'SelectedArmor' ) || '',
                engine:     localStorage.getItem( 'SelectedEngine' ) || '',
            };

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
