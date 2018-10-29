/*
 * @author ohmed
 * DatTank Landing UI module
*/

import { UI } from './Core.UI';
import { Game } from './../Game';
import { Logger } from '../utils/Logger';

//

export class UILandingModule {

    public initPlayBtn () : void {

        $('#start-btn').html('PLAY!');

    };

    public noArenaAvailable () : void {

        $('#start-btn').html('No free arenas :(');

    };

    public setVersion ( version: string ) : void {

        $('#dt-version').html( version );

    };

    public setTopPlayersBoard ( players: any[] ) : void {

        if ( players.length < 10 ) return;

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            $( $('.top-players-score tr')[ i + 1 ] ).find('td')[0].innerHTML = '<span class="nmb">' + ( i + 1 ) + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>' + players[ i ].login + '</span>';
            $( $('.top-players-score tr')[ i + 1 ] ).find('td')[1].innerHTML = players[ i ].score + ' / ' + players[ i ].kills;

        }

        $('.top-players-score').css('visibility', 'visible');

    };

    public hide () : void {

        $('#footer').hide();
        $('#signin-box-wrapper').hide();
        $('#graphics-quality').hide();
        $('#sound').hide();
        $('#fullscreen').hide();
        $('.share-btns').hide();
        $('.top-left-like-btns').hide();
        $('.new-features-box').hide();
        $('.top-players-score').hide();
        $('#IOG_CP').hide();

    };

    public showLoader () : void {

        $('#loader-wrapper').show();
        $('#loader-wrapper').css( 'opacity', 1 );

    };

    public setLoaderLabelToInit () : void {

        $('#loader-wrapper #progress-wrapper').hide();
        $('#loader-wrapper #loader-wrapper-title').html('Initializing arena...');

    };

    public hideLoader () : void {

        $('#loader-wrapper').hide();
        $('#loader-wrapper').css( 'opacity', 0 );

    };

    public setLoaderProgress ( value: number ) : void {

        const label = Math.round( 100 * value ) + '%';
        $('#loader-wrapper #progress-wrapper #progress-bar').css( 'width', label );
        $('#loader-wrapper #loader-wrapper-title span').html( label );

    };

    public init () : void {

        // init sign in block

        const login = $('#username').val() || localStorage.getItem('login') || '';
        $('#username').val( login );

        // add handlers

        $('#signin-box #username').focus();
        $('#signin-box #username').keydown( ( event ) => {

            if ( ! Game.ready ) return;

            if ( event.keyCode === 13 && ! Game.garage.isOpened ) {

                event.stopPropagation();
                document.activeElement!['blur']();
                Game.garage.show();

            }

        });

        //

        $('#start-btn').click( Game.garage.show.bind( Game.garage ) );
        $('#fullscreen').click( UI.toggleFullscreenMode.bind( UI ) );

        $('#graphics-quality').click( UI.changeQuality.bind( UI ) );
        $('#sound').click( UI.changeSound.bind( UI ) );
        $('#help').click( UI.showHelp.bind( UI ) );
        $('.help-popup .close').click( UI.hideHelp.bind( UI ) );
        $('.help-popup .ok-btn').click( UI.hideHelp.bind( UI ) );

        $('.share-btns .btn-share-vk').mousedown( Logger.newEvent.bind( Logger, 'ShareVK', 'game' ) );
        $('.share-btns .btn-share-fb').mousedown( Logger.newEvent.bind( Logger, 'ShareFB', 'game' ) );
        $('.share-btns .btn-share-tw').mousedown( Logger.newEvent.bind( Logger, 'ShareTW', 'game' ) );

        setTimeout( () => { $('.fb-like').animate( { opacity: 1 }, 500 ); }, 1000 );
        setTimeout( () => { $('.folow-btn').animate( { opacity: 1 }, 500 ); }, 1600 );

    };

};
