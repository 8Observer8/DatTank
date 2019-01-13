/*
 * @author ohmed
 * DatTank Chat UI module
*/

import * as OMath from '../OMath/Core.OMath';
import { Logger } from '../utils/Logger';
import { UI } from './Core.UI';
import { Arena } from '../core/Arena.Core';
import { TeamManager } from '../managers/arena/Team.Manager';
import { Network } from '../network/Core.Network';

//

export class UIChatModule {

    public opened: boolean = false;
    private usedChat: boolean = false;

    //

    private showChatMessageInput () : void {

        this.opened = true;

        $('.chat .message-block').show();
        $('.chat .message-block-separate').hide();
        $('.chat .message-input').show();

        if ( $('.tank-upgrade-block').attr('opened') === 'true' ) {

            $('.tank-upgrade-block').hide();
            $('.chat .message-block-separate').show();

        }

        $('.arena-level-indicator-block').hide();

        $('.chat .message-input').focus();

        localStorage.setItem( 'UsedChat', 'true' );
        this.usedChat = true;
        this.hideHelpInfo();

        //

        Logger.newEvent( 'ChatOpened', 'game' );

    };

    public hideChatMessageInput () : void {

        this.opened = false;

        $('.chat .message-block').hide();
        $('.chat .message-block-separate').show();
        $('.chat .message-input').hide();

        if ( $('.tank-upgrade-block').attr('opened') === 'true' ) {

            $('.arena-level-indicator-block').hide();
            $('.tank-upgrade-block').show();
            $('.chat .message-block-separate').hide();

        } else {

            $('.arena-level-indicator-block').show();
            $('.tank-upgrade-block').hide();
            $('.chat .message-block-separate').show();

        }

    };

    private showHelpInfo () : void {

        $('.chat .chat-info').css( 'bottom', '20px' );

    };

    private hideHelpInfo () : void {

        $('.chat .chat-info').css( 'bottom', '-20px' );

    };

    private keypress ( event: KeyboardEvent ) : void {

        if ( ! UI.InGame.opened ) return;

        if ( event.keyCode === 13 ) {

            const inputValue = $('.chat .message-input').val();

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

    public newMessage ( params: any ) : void {

        const messages = $('.chat .message-block .message');

        for ( let i = messages.length; i > 5; i -- ) {

            messages[ messages.length - i ].remove();

        }

        const messagesSeparate = $('.chat .message-block-separate .message');

        for ( let i = messagesSeparate.length; i > 5; i -- ) {

            messagesSeparate[ messagesSeparate.length - i ].remove();

        }

        //

        const teamColor = OMath.intToHex( OMath.darkerColor( TeamManager.getById( params.teamId )!.color, 0.85 ) );
        let messageDom = $('<div class="message"><span class="author" style="color: ' + teamColor + '"></span><span class="message-text"></span></div>');
        messageDom.find('.author').text( ( params.onlyTeam ? '[TEAM] ' : '[ALL] ' ) + params.login + ':' );
        messageDom.find('.message-text').text( params.message );

        $('.chat .message-block').append( messageDom );

        messageDom = $('<div class="message"><span class="author" style="color: ' + teamColor + '"></span><span class="message-text"></span></div>');
        messageDom.find('.author').text( ( params.onlyTeam ? '[TEAM] ' : '[ALL] ' ) + params.login + ':' );
        messageDom.find('.message-text').text( params.message );
        $('.chat .message-block-separate').append( messageDom );

        const lastMsgSeparate = $('.chat .message-block-separate .message').last();

        setTimeout( () => {

            lastMsgSeparate.animate({ opacity: 0 }, 3000 );
            setTimeout( () => {

                lastMsgSeparate.remove();

            }, 3000 );

        }, 3500 );

    };

    public init () : void {

        $( document ).bind( 'keydown', this.keypress.bind( this ) );
        $('.chat .message-input').bind( 'keydown', this.keypress.bind( this ) );
        $('.chat .message-input').keydown( ( event ) => { event.stopPropagation(); } );
        $('.chat .message-input').keyup( ( event ) => { event.stopPropagation(); } );

        this.usedChat = ( localStorage.getItem('UsedChat') === 'true' );
        if ( ! this.usedChat ) {

            setTimeout( this.showHelpInfo.bind( this ), 8000 );

        }

    };

};
