/*
 * @author ohmed
 * DatTank Landing UI module
*/

import { UI } from './Core.UI';
import { Game } from './../Game';
import { SoundManager } from '../managers/other/Sound.Manager';

//

export class UILandingModule {

    public showNotSupportInfo () : void {

        $('.mobile-not-supported').show();
        $('body *:not(.not-disabled-screen)').addClass('disabled-screen');

        setTimeout( () => {

            $('.mobile-not-supported .title').css({ opacity: 1, transform: 'translate( 0px, 40vh )' });

        }, 200 );

    };

    public setVersion ( version: string ) : void {

        $('#dt-version').html( version );

    };

    public setTopPlayersBoard ( players: any[] ) : void {

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            $( $('.top-players-score tr')[ i + 1 ] ).find('td.login').html( '<span class="nmb">' + ( i + 1 ) + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>' + players[ i ].login + '</span>' );
            $( $('.top-players-score tr')[ i + 1 ] ).find('td.level').html( players[ i ].level );
            $( $('.top-players-score tr')[ i + 1 ] ).find('td.score').html( players[ i ].score );
            $( $('.top-players-score tr')[ i + 1 ] ).find('td.kills').html( players[ i ].kills );
            $( $('.top-players-score tr')[ i + 1 ] ).find('td.death').html( players[ i ].death );

        }

        $('.top-players-score').css('visibility', 'visible');

    };

    public hide () : void {

        $('#footer').hide();
        $('#signin-box-wrapper').hide();
        $('.landing .graphics-quality').hide();
        $('.landing .sound').hide();
        $('.landing .fullscreen').hide();

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

    private start () : void {

        const login = $('#username').val() || localStorage.getItem('login') || '';
        localStorage.setItem( 'login', login + '' );

        $('#signin-box-wrapper #signin-box').css({ transform: 'scale( 0.9 )' });
        $('#signin-box-wrapper #signin-box').animate({ opacity: 0 }, 300 );

        Game.garage.show();

    };

    private switchMenu ( event: MouseEvent ) : void {

        const oldTab = $('#signin-box-wrapper #main-block #menu .item.active').attr('tab');
        const newTab = $( event.currentTarget! ).attr('tab');
        if ( oldTab === newTab ) return;

        SoundManager.playSound('ElementSelect');
        $('#signin-box-wrapper #main-block #menu .item.active').removeClass('active');
        $( event.currentTarget! ).addClass('active');

        $('#signin-box-wrapper .tab-content.active').removeClass('active');
        $('#signin-box-wrapper .tab-content.' + newTab ).show();
        $('#signin-box-wrapper .tab-content.' + newTab ).addClass('active');

        setTimeout( () => {

            $('#signin-box-wrapper .tab-content.' + oldTab ).hide();

        }, 300 );

    };

    public init () : void {

        // init sign in block

        const login = localStorage.getItem('login') || '';
        $('#username').val( login );

        // add handlers

        $('#signin-box #username').focus();
        $('#signin-box #username').keydown( ( event ) => {

            if ( event.keyCode === 13 && ! Game.garage.isOpened ) {

                event.stopPropagation();
                document.activeElement!['blur']();
                this.start();

            }

        });

        //

        $('#start-btn').click( this.start );
        $('.landing .fullscreen').click( UI.toggleFullscreenMode.bind( UI ) );
        $('.landing .graphics-quality').click( UI.changeQuality.bind( UI ) );
        $('.landing .sound').click( UI.changeSound.bind( UI ) );
        $('.landing .help').click( UI.showHelp.bind( UI ) );
        $('.help-popup .close').click( UI.hideHelp.bind( UI ) );
        $('.help-popup .ok-btn').click( UI.hideHelp.bind( UI ) );

        $('#signin-box-wrapper #main-block #menu .item').click( this.switchMenu.bind( this ) );
        $('#signin-box-wrapper #main-block #menu .item').mouseenter( () => {

            SoundManager.playSound('ElementHover');

        });

        $('.btn').mouseenter( () => {

            SoundManager.playSound('ElementHover');

        });

        $('#signin-box-wrapper #main-block .tab-content.screens .right-arrow').click( () => {

            SoundManager.playSound('ElementSelect');
            const active = $('#signin-box-wrapper #main-block .tab-content.screens img.active');
            const iid = + active.attr('iid')!;
            active.removeClass('active');

            if ( iid === 3 ) {

                $( '#signin-box-wrapper #main-block .tab-content.screens img[iid="1"]' ).addClass('active');

            } else {

                $( '#signin-box-wrapper #main-block .tab-content.screens img[iid="' + ( iid + 1 ) + '"]' ).addClass('active');

            }

        });

        $('#signin-box-wrapper #main-block .tab-content.screens .left-arrow').click( () => {

            SoundManager.playSound('ElementSelect');
            const active = $('#signin-box-wrapper #main-block .tab-content.screens img.active');
            const iid = + active.attr('iid')!;
            active.removeClass('active');

            if ( iid === 1 ) {

                $( '#signin-box-wrapper #main-block .tab-content.screens img[iid="3"]' ).addClass('active');

            } else {

                $( '#signin-box-wrapper #main-block .tab-content.screens img[iid="' + ( iid - 1 ) + '"]' ).addClass('active');

            }

        });

        let textLength = 0;

        setInterval( () => {

            const fullText = 'Good tank pilot?|   Are you ready for the bettle ?...                ';
            let text = $('#signin-box-wrapper #main-block .tab-content.home .title').html();

            if ( ! fullText[ textLength ] ) {

                text = '';
                textLength = 0;

            }

            const char = ( fullText[ textLength ] === '|' ) ? '<br>' : fullText[ textLength ];
            $('#signin-box-wrapper #main-block .tab-content.home .title').html( text.replace( '_', '' ) + char + '_' );

            textLength ++;

        }, 250 );

        setTimeout( () => { $('.fb-like').animate( { opacity: 1 }, 500 ); }, 1000 );
        setTimeout( () => { $('.folow-btn').animate( { opacity: 1 }, 500 ); }, 1600 );

    };

};
