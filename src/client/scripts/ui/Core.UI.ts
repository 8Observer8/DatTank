/*
 * @author ohmed
 * DatTank global UI core
*/

import { UILandingModule } from "./Landing.UI";
import { UIInGameModule } from "./InGame.UI";
import { GfxCore } from "./../graphics/Core.Gfx";
import { SoundManager } from "./../managers/Sound.Manager";
import { ControlsManager } from "./../managers/Control.Manager";

//

class UICore {

    private static instance: UICore;

    public Landing = new UILandingModule();
    public InGame = new UIInGameModule();

    //

    public changeQuality ( value, withoutSound ) {

        value = ( typeof value === 'boolean' ) ? value : $( value.currentTarget ).attr('hq') !== 'true';
        $('#graphics-quality').attr( 'hq', value );
        $('#viewport-graphics-quality').attr( 'hq', value );
        localStorage.setItem( 'hq', value );

        if ( value ) {

            GfxCore.setQuality('HIGH');

        } else {

            GfxCore.setQuality('LOW');

        }

        ControlsManager.mouseInit();

        if ( ! withoutSound ) {

            SoundManager.playSound('MenuClick');

        }

    };

    public changeSound ( value, withoutSound ) {

        value = ( typeof value === 'boolean' ) ? value : $( value.currentTarget ).attr('sound') !== 'true';
        $('#sound-on-off').attr( 'sound', value );
        $('#viewport-sound-on-off').attr( 'sound', value );
        localStorage.setItem( 'sound', value );

        SoundManager.toggleMute( ! value );

        if ( ! withoutSound ) {

            SoundManager.playSound('MenuClick');

        }

    }; 

    private onFullscreenModeChange () {

        let isFullscreen = document['fullscreenElement'] || document['mozFullScreenElement'] || document['webkitFullscreenElement'] || document['msFullscreenElement'];
        isFullscreen = ( isFullscreen !== undefined );

        //

        $('#fullscreen-on-off').attr( 'screen', isFullscreen );
        $('#viewport-fullscreen-on-off').attr( 'screen', isFullscreen );

    };

    public toggleFullscreenMode ( value ) {

        value = ( typeof value === 'boolean' ) ? value : $( value.currentTarget ).attr('screen') !== 'true';

        //

        SoundManager.playSound('MenuClick');

        if ( value ) {

            let element = document.body;

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

    public init () {

        this.Landing.init();
        this.InGame.init();

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

export let UI = new UICore();
