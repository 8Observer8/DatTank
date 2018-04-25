/*
 * @author ohmed
 * DatTank In Game UI module
*/

import { Arena } from "../core/Arena.Core";
import { UI } from "./../ui/Core.UI";
import { Game } from "./../Game";

//

class UIInGameModule {

    public init () {

        // nothing here

    };

    public showContinueBox ( username, color ) {

        // this.hideTankStatsUpdate();

        $('#continue-box-wrapper #continue-btn').off();    
        $('#continue-box-wrapper #continue-btn').click( () => {
    
            Arena.me.triggerRespawn();
    
        });
    
        $('#continue-box-wrapper').show();
        $('#continue-box-wrapper #continue-box-wrapper-title').html('<p>Killed by <span style="color:'+ color + '">' + username +'</span></p>');
        $('#continue-box-wrapper #change-tank').click( Game.garage.show.bind( Game.garage ) );
    
        setTimeout( function () {
    
            $('#continue-box-wrapper').css( 'opacity', 1 );
    
        }, 100 );

    };

    public hideContinueBox () {

        $('#continue-box-wrapper').css( 'opacity', 0 );

        setTimeout( () => {
    
            $('#continue-box-wrapper').hide();
    
        }, 200);

    };

    public showDisconectMessage () {

        $('.disconnect-warning').show();

    };

    public updateHealth ( value: number ) {

        $('#health-number').html( value + "" );
        $('#empty-health-image').css( 'height', ( 100 - value ) + '%' );

    };

    public updateAmmo ( value: number ) {

        $('#ammo-number').html( value + "" );

    };

    public setAmmoReloadAnimation ( duration: number ) {

        var element = $('#empty-ammo-image');
        // -> removing the class
        element.removeClass('ammo-animation');
        element.css( 'height', '100%' );

        // -> triggering reflow / The actual magic /
        // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
        element[0].offsetWidth;
        element.css( 'background-image', 'url(../resources/img/ammo.png)' );

        // -> and re-adding the class
        element.addClass('ammo-animation');
        element.css( 'animation-duration', 1.2 * duration + 'ms' );

    };

    public showViewport () {

        $('#viewport').show();

    };

};

//

export { UIInGameModule };
