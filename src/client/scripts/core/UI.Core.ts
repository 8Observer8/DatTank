/*
 * @author ohmed
 * DatTank global UI core
*/

import { UILandingModule } from "./../ui/Landing.Module";
import { UIGarageModule } from "./../ui/Garage.Module";
import { UIInGameModule } from "./../ui/InGame.Module";

//

class UICore {

    public modules = {
        landing:    new UILandingModule(),
        garage:     new UIGarageModule(),
        inGame:     new UIInGameModule()
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

        this.modules.landing.init();
        this.modules.garage.init();
        this.modules.inGame.init();

        //

        $( document ).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', this.onFullscreenModeChange.bind( this ) );

        //

        console.log( 'Game UI inited' );

    };

};

export { UICore };
