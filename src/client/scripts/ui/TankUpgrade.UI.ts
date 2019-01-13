/*
 * @author ohmed
 * DatTank Tank upgrade in Game UI module
*/

import { UI } from '../ui/Core.UI';
import { Arena } from '../core/Arena.Core';
import { Game } from '../Game';
import { SoundManager } from '../managers/other/Sound.Manager';

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
        $('.arena-level-indicator-block .title').html( 'Arena skill ' + ( level + 1 ) );
        $('.arena-level-indicator-block .progress-bar .progress-indicator').css( 'width', levelProgress + '%' );

    };

    public showUpgradeMenu ( bonusLevels: number ) : void {

        if ( ! Arena.me.tank || ( Arena.me.tank && Arena.me.tank.health <= 0 ) ) return;
        this.updateUpgradeMenu();

        //

        $('.tank-upgrade-block .bonus .increase').off();
        $('.tank-upgrade-block').show();
        $('.tank-upgrade-block').attr('opened', 'true');
        $('.chat .message-block-separate').hide();
        this.hideProgressIndicator();
        $('.tank-upgrade-block .title').html( 'You have ' + bonusLevels + ' bonus skills.' );
        $('.tank-upgrade-block .bonus .increase').click( this.upgradeTank.bind( this ) );
        UI.Chat.hideChatMessageInput();

        $( document ).unbind( 'keydown.handler' );
        $( document ).bind( 'keydown.handler', this.keyHandler.bind( this ) );

        $('.tank-upgrade-block .bonus .increase').mouseover( () => {

            SoundManager.playSound('ElementSelect');

        });

    };

    public updateUpgradeMenu () : void {

        if ( ! Arena.me.tank || ( Arena.me.tank && Arena.me.tank.health <= 0 ) ) return;

        //

        $('.tank-upgrade-block .bonus.armor .progress .item').removeClass('active');

        for ( let i = 0; i < 5; i ++ ) {

            if ( Arena.me.tank.upgrades.maxSpeed > i ) $( $('.tank-upgrade-block .bonus.maxSpeed .progress .item')[ i ] ).addClass('active');
            if ( Arena.me.tank.upgrades.rpm > i ) $( $('.tank-upgrade-block .bonus.rpm .progress .item')[ i ] ).addClass('active');
            if ( Arena.me.tank.upgrades.armor > i ) $( $('.tank-upgrade-block .bonus.armor .progress .item')[ i ] ).addClass('active');
            if ( Arena.me.tank.upgrades.cannon > i ) $( $('.tank-upgrade-block .bonus.cannon .progress .item')[ i ] ).addClass('active');
            if ( Arena.me.tank.upgrades.power > i ) $( $('.tank-upgrade-block .bonus.power .progress .item')[ i ] ).addClass('active');

        }

        $('.tank-upgrade-block .bonus .increase').removeClass('disabled');

        if ( Arena.me.tank.upgrades.maxSpeed === 5 ) $('.tank-upgrade-block .bonus.maxSpeed .increase').addClass('disabled');
        if ( Arena.me.tank.upgrades.rpm === 5 ) $('.tank-upgrade-block .bonus.rpm .increase').addClass('disabled');
        if ( Arena.me.tank.upgrades.armor === 5 ) $('.tank-upgrade-block .bonus.armor .increase').addClass('disabled');
        if ( Arena.me.tank.upgrades.cannon === 5 ) $('.tank-upgrade-block .bonus.cannon .increase').addClass('disabled');
        if ( Arena.me.tank.upgrades.power === 5 ) $('.tank-upgrade-block .bonus.power .increase').addClass('disabled');

    };

    public hideUpgradeMenu () : void {

        $('.tank-upgrade-block').hide();
        $('.chat .message-block-separate').show();
        $('.tank-upgrade-block').attr('opened', 'false');
        $( document ).unbind( 'keydown.handler' );
        this.showProgressIndicator();

    };

    private keyHandler = ( event: KeyboardEvent ) : void => {

        if ( ! Arena.me.bonusArenaLevels ) return;

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
        if ( Arena.me.tank.upgrades[ statName ] === 5 ) return;

        this.updateUpgradeMenu();
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
