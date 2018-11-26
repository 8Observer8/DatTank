/*
 * @author ohmed
 * DatTank global UI core
*/

import { Logger } from '../utils/Logger';
import { UILandingModule } from './Landing.UI';
import { UIInGameModule } from './InGame.UI';
import { UIChatModule } from './Chat.UI';
import { GfxCore } from '../graphics/Core.Gfx';
import { SoundManager } from '../managers/Sound.Manager';
import { ControlsManager } from '../managers/Control.Manager';

//

class UICore {

    private static instance: UICore;

    public Landing = new UILandingModule();
    public InGame = new UIInGameModule();
    public Chat = new UIChatModule();

    //

    public showHelp () : void {

        Logger.newEvent( 'OpenHelp', 'game' );
        SoundManager.playSound('MenuClick');
        $('.help-popup').show();

    };

    public hideHelp () : void {

        SoundManager.playSound('MenuClick');
        $('.help-popup').hide();

    };

    public changeQuality ( value: boolean | MouseEvent, withoutSound: boolean ) : void {

        const isHQ = ( typeof value === 'boolean' ) ? value : $( value.currentTarget! ).attr('hq') !== 'true';
        $('#graphics-quality').attr( 'hq', isHQ.toString() );
        $('#viewport-graphics-quality').attr( 'hq', isHQ.toString() );
        localStorage.setItem( 'hq', isHQ.toString() );

        if ( isHQ ) {

            GfxCore.setQuality('HIGH');

        } else {

            GfxCore.setQuality('LOW');

        }

        ControlsManager.mouseInit();

        if ( ! withoutSound ) {

            Logger.newEvent( 'SettingsHQChange', 'game' );
            SoundManager.playSound('MenuClick');

        }

    };

    public changeSound ( value: boolean | MouseEvent, withoutSound: boolean ) : void {

        const isSound = ( typeof value === 'boolean' ) ? value : $( value.currentTarget! ).attr('sound') !== 'true';
        $('.sound').attr( 'sound', isSound.toString() );
        localStorage.setItem( 'sound', isSound.toString() );

        SoundManager.toggleMute( ! isSound );

        if ( ! withoutSound ) {

            Logger.newEvent( 'SettingsSoundChange', 'game' );
            SoundManager.playSound('MenuClick');

        }

    };

    private onFullscreenModeChange () : void {

        let isFullscreen = document['fullscreenElement'] || document['mozFullScreenElement'] || document['webkitFullscreenElement'] || document['msFullscreenElement'];
        isFullscreen = ( isFullscreen !== undefined );

        //

        $('.fullscreen').attr( 'screen', isFullscreen );

    };

    public toggleFullscreenMode ( value: boolean | MouseEvent ) : void {

        const isFullscreen = ( typeof value === 'boolean' ) ? value : $( value.currentTarget! ).attr('screen') !== 'true';

        //

        SoundManager.playSound('MenuClick');

        if ( isFullscreen ) {

            const element = document.body;

            if ( element['requestFullscreen'] ) {

                element['requestFullscreen']();

            } else if ( element['mozRequestFullScreen'] ) {

                element['mozRequestFullScreen']();

            } else if ( element['webkitRequestFullScreen'] ) {

                element['webkitRequestFullScreen']();

            } else if ( element['msRequestFullscreen'] ) {

                element['msRequestFullscreen']();

            }

        } else {

            if ( document['exitFullscreen'] ) {

                document['exitFullscreen']();

            } else if ( document['mozCancelFullScreen'] ) {

                document['mozCancelFullScreen']();

            } else if ( document['webkitExitFullscreen'] ) {

                document['webkitExitFullscreen']();

            }

        }

    };

    public init () : void {

        this.Landing.init();
        this.InGame.init();
        this.Chat.init();

        //

        $( document ).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', this.onFullscreenModeChange.bind( this ) );

        //

        console.log( 'Game UI inited' );

    };

    //

    constructor () {

        if ( UICore.instance ) {

            return UICore.instance;

        }

        UICore.instance = this;

    };

};

//

export let UI = new UICore();
