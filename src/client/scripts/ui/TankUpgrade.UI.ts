/*
 * @author ohmed
 * DatTank Tank upgrade in Game UI module
*/

import { UI } from '../ui/Core.UI';
import { Arena } from '../core/Arena.Core';
import { Game } from '../Game';
import { SoundManager } from '../managers/Sound.Manager';

//

export class UITankUpgrade {

    public showProgressIndicator () : void {

        $('.arena-level-indicator-block').show();
        UI.Chat.hideChatMessageInput();

    };

    public hideProgressIndicator () : void {

        $('.arena-level-indicator-block').hide();

    };

    public updateProgressIndicator () : void {

        let level = 0;
        const levels = Game.GarageConfig.arenaLevels;

        while ( levels[ level ].score <= Arena.me.score ) {

            level ++;

        }

        const currentLevelScore = levels[ level ].score;
        const nextLevelScore = ( levels[ level - 1 ] ) ? levels[ level - 1 ].score : 0;
        const levelProgress = 100 * ( 1 - ( currentLevelScore - Arena.me.score ) / ( currentLevelScore - nextLevelScore ) );
        $('.arena-level-indicator-block .title').html( 'Arena Level ' + ( level + 1 ) );
        $('.arena-level-indicator-block .progress-bar .progress-indicator').css( 'width', levelProgress + '%' );

    };

    public showUpgradeMenu ( bonusLevels: number ) : void {

        if ( Arena.me.tank && Arena.me.tank.health <= 0 ) return;

        $('.tank-upgrade-block .bonus .increase').off();
        $( document ).unbind( 'keypress' );

        $('.tank-upgrade-block').show();
        $('.tank-upgrade-block').attr('opened', 'true');
        $('.chat .message-block-separate').hide();
        this.hideProgressIndicator();
        $('.tank-upgrade-block .title').html( 'You have ' + bonusLevels + ' bonus levels.' );
        $('.tank-upgrade-block .bonus .increase').click( this.upgradeTank.bind( this ) );
        UI.Chat.hideChatMessageInput();

        $( document ).bind( 'keypress', this.keyHandler.bind( this ) );

    };

    public hideUpgradeMenu () : void {

        $('.tank-upgrade-block').hide();
        $('.chat .message-block-separate').show();
        $('.tank-upgrade-block').attr('opened', 'false');
        $( document ).unbind( 'keypress' );
        this.showProgressIndicator();

    };

    private keyHandler ( event: KeyboardEvent ) : void {

        switch ( event.keyCode ) {

            case 49:

                this.upgradeTank('maxSpeed');
                break;

            case 50:

                this.upgradeTank('rpm');
                break;

            case 51:

                this.upgradeTank('armor');
                break;

            case 52:

                this.upgradeTank('cannon');
                break;

            case 53:

                this.upgradeTank('power');
                break;

        }

    };

    private upgradeTank ( event: MouseEvent | string ) : void {

        if ( ! Arena.me.tank || Arena.me.tank.health <= 0 ) return;

        const statName = ( typeof event === 'string' ) ? event : event.currentTarget!['parentNode'].className.replace( 'bonus ', '' );
        Arena.me.tank.upgrade( statName );
        Arena.me.bonusArenaLevels --;
        SoundManager.playSound('MenuClick');
        this.hideUpgradeMenu();

        //

        if ( Arena.me.bonusArenaLevels > 0 ) {

            this.showUpgradeMenu( Arena.me.bonusArenaLevels );

        }

    };

};
