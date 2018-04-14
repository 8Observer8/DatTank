/*
 * @author ohmed
 * DatTank global UI core
*/

import { UILandingModule } from "./Landing.UI";
import { UIInGameModule } from "./InGame.UI";

//

class UICore {

    private static instance: UICore;

    public Landing = new UILandingModule();
    public InGame = new UIInGameModule();

    //

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
