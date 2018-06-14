/*
 * @author ohmed
 * DatTank Chat UI module
*/

import * as OMath from "./../OMath/Core.OMath";
import { UI } from "./Core.UI";
import { Arena } from "./../core/Arena.Core";
import { TeamManager } from "./../managers/Team.Manager";
import { Network } from "./../network/Core.Network";

//

class UIChatModule {

    public opened: boolean = false;

    //

    private showChatMessageInput () {

        $('.chat .message-input').show();
        UI.InGame.hideLevelIndicator();
        $('.chat .message-input').focus();

    };

    private hideChatMessageInput () {

        $('.chat .message-input').hide();
        UI.InGame.showLevelIndicator();

    };

    private keypress ( event ) {

        if ( ! UI.InGame.opened ) return;

        if ( event.keyCode === 13 ) {

            let inputValue = $('.chat .message-input').val();

            if ( ! this.opened ) {

                this.showChatMessageInput();
                this.opened = true;

            } else if ( inputValue === '' ) {

                this.hideChatMessageInput();
                this.opened = false;

            } else if ( inputValue !== '' ) {

                Network.send( 'ArenaChatMessage', false, { playerId: Arena.me.id, message: inputValue } );
                $('.chat .message-input').val('');

            }

        }

    };

    public newMessage ( params ) {

        let teamColor = OMath.intToHex( OMath.darkerColor( TeamManager.getById( params.teamId ).color, 0.85 ) );
        $('.chat .message-block').append('<div class="message"><span style="color: ' + teamColor + '">' + ( params.onlyTeam ? '[TEAM] ' : '[ALL] ' ) + params.login + ':</span> ' + params.message + '</div>');

    };

    public init () {

        $( window ).bind( 'keypress', this.keypress.bind( this ) );
        $('.chat .message-input').keydown( ( event ) => { event.stopPropagation(); } );
        $('.chat .message-input').keyup( ( event ) => { event.stopPropagation(); } );

    };

};

//

export { UIChatModule };
