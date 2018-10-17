/*
 * @author ohmed
 * DatTank Chat UI module
*/

import * as OMath from "./../OMath/Core.OMath";
import { Logger } from "./../utils/Logger";
import { UI } from "./Core.UI";
import { Arena } from "./../core/Arena.Core";
import { TeamManager } from "./../managers/Team.Manager";
import { Network } from "./../network/Core.Network";

//

class UIChatModule {

    public opened: boolean = false;
    private usedChat: boolean = false;

    //

    private showChatMessageInput () {

        this.opened = true;

        $('.chat .message-block').show();
        $('.chat .message-block-separate').hide();
        $('.chat .message-input').show();

        if ( $('.stats-update-block').attr('opened') === 'true' ) {

            $('.stats-update-block').hide();
            $('.chat .message-block-separate').show();

        }

        $('.level-indicator-block').hide();

        $('.chat .message-input').focus();

        localStorage.setItem( 'UsedChat', 'true' );
        this.usedChat = true;
        this.hideHelpInfo();

        //

        Logger.newEvent( 'ChatOpened', 'game' );

    };

    public hideChatMessageInput () {

        this.opened = false;

        $('.chat .message-block').hide();
        $('.chat .message-block-separate').show();
        $('.chat .message-input').hide();

        if ( $('.stats-update-block').attr('opened') === 'true' ) {

            $('.level-indicator-block').hide();
            $('.stats-update-block').show();
            $('.chat .message-block-separate').hide();

        } else {

            $('.level-indicator-block').show();
            $('.stats-update-block').hide();
            $('.chat .message-block-separate').show();

        }

    };

    private showHelpInfo () {

        $('.chat .chat-info').css( 'bottom', '20px' );

    };

    private hideHelpInfo () {

        $('.chat .chat-info').css( 'bottom', '-20px' );

    };

    private keypress ( event: KeyboardEvent ) {

        if ( ! UI.InGame.opened ) return;

        if ( event.keyCode === 13 ) {

            let inputValue = $('.chat .message-input').val();

            if ( ! this.opened ) {

                this.showChatMessageInput();

            } else if ( inputValue === '' ) {

                this.hideChatMessageInput();

            } else if ( inputValue !== '' ) {

                Network.send( 'ArenaChatMessage', false, { playerId: Arena.me.id, message: inputValue } );
                $('.chat .message-input').val('');
                Logger.newEvent( 'ChatNewMessage', 'game' );

            }

        }

    };

    public newMessage ( params: any ) {

        let messages = $('.chat .message-block .message');

        for ( let i = messages.length; i > 5; i -- ) {

            messages[ messages.length - i ].remove();

        }

        let messagesSeparate = $('.chat .message-block-separate .message');

        for ( let i = messagesSeparate.length; i > 5; i -- ) {

            messagesSeparate[ messagesSeparate.length - i ].remove();

        }

        //

        let teamColor = OMath.intToHex( OMath.darkerColor( TeamManager.getById( params.teamId )!.color, 0.85 ) );
        let messageDom = $('<div class="message"><span class="author" style="color: ' + teamColor + '"></span><span class="message-text"></span></div>');
        messageDom.find('.author').text( ( params.onlyTeam ? '[TEAM] ' : '[ALL] ' ) + params.login + ':' );
        messageDom.find('.message-text').text( params.message );

        $('.chat .message-block').append( messageDom );

        messageDom = $('<div class="message"><span class="author" style="color: ' + teamColor + '"></span><span class="message-text"></span></div>');
        messageDom.find('.author').text( ( params.onlyTeam ? '[TEAM] ' : '[ALL] ' ) + params.login + ':' );
        messageDom.find('.message-text').text( params.message );
        $('.chat .message-block-separate').append( messageDom );

        let lastMsgSeparate = $('.chat .message-block-separate .message').last();

        setTimeout( () => {

            lastMsgSeparate.animate({ opacity: 0 }, 3000 );
            setTimeout( () => {

                lastMsgSeparate.remove();

            }, 3000 );

        }, 3500 );

    };

    public init () {

        $( window ).bind( 'keypress', this.keypress.bind( this ) );
        $('.chat .message-input').keydown( ( event ) => { event.stopPropagation(); } );
        $('.chat .message-input').keyup( ( event ) => { event.stopPropagation(); } );

        this.usedChat = ( localStorage.getItem('UsedChat') === 'true' );
        if ( ! this.usedChat ) {

            setTimeout( this.showHelpInfo.bind( this ), 8000 );

        }

    };

};

//

export { UIChatModule };
