/*
 * @author ohmed
 * DatTank Landing UI module
*/

import { UI } from "./Core.UI";
import { Game } from "./../Game";

//

class UILandingModule {

    public initPlayBtn () {

        $('#play-btn #play-btn-text').html('PLAY!');

    };

    public setVersion ( version: string ) {

        $('#dt-version').html( version );

    };

    public setTopPlayersBoard ( players ) {

        if ( players.length < 10 ) return;

        for ( var i = 0, il = players.length; i < il; i ++ ) {

            $( $('.top-players-score tr')[ i + 1 ] ).find('td')[0].innerHTML = '<span class="nmb">' + ( i + 1 ) + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>' + players[ i ].login + '</span>';
            $( $('.top-players-score tr')[ i + 1 ] ).find('td')[1].innerHTML = players[ i ].score + ' / ' + players[ i ].kills;

        }

        $('.top-players-score').css('visibility', 'visible');

    };

    public hide () {

        $('#footer').hide();
        $('#signin-box-wrapper').hide();
        $('#graphics-quality').hide();
        $('#sound-on-off').hide();
        $('#fullscreen-on-off').hide();
        $('#share-btn').hide();
        $('.top-left-like-btns').hide();
        $('.new-features-box').hide();
        $('.top-players-score').hide();

    };

    public showLoader () {

        $('#loader-wrapper').show();
        $('#loader-wrapper').css( 'opacity', 1 );

    };

    public setLoaderLabelToInit () {

        $('#loader-wrapper #progress-wrapper').hide();
        $('#loader-wrapper #loader-wrapper-title').html('Initializing arena...');

    };

    public hideLoader () {

        $('#loader-wrapper').hide();
        $('#loader-wrapper').css( 'opacity', 0 );

    };

    public setLoaderProgress ( value: number ) {

        let label = Math.round( 100 * value ) + '%';
        $('#loader-wrapper #progress-wrapper #progress-bar').css( 'width', label );
        $('#loader-wrapper #loader-wrapper-title span').html( label );

    };

    public init () {

        // init sign in block

        var login = $('#username').val() || localStorage.getItem('login') || '';
        $('#username').val( login );

        // add handlers

        $('#signin-box #username').focus();
        $('#signin-box #username').keydown( ( event ) => {

            if ( ! Game.ready ) return;

            if ( event.keyCode === 13 && ! Game.garage.isOpened ) {

                event.stopPropagation();
                document.activeElement['blur']();
                Game.garage.show();

            }

        });

        //

        $('#play-btn').click( Game.garage.show.bind( Game.garage ) );
        $('#fullscreen-on-off').click( UI.toggleFullscreenMode.bind( UI ) );

        setTimeout( function () { $('.fb-like').animate( { opacity: 1 }, 500 ); }, 1000 );
        setTimeout( function () { $('.folow-btn').animate( { opacity: 1 }, 500 ); }, 1200 );

    };

};

//

export { UILandingModule };
