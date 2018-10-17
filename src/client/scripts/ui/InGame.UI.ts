/*
 * @author ohmed
 * DatTank In Game UI module
*/

import * as OMath from "./../OMath/Core.OMath";
import { Arena } from "./../core/Arena.Core";
import { UI } from "./../ui/Core.UI";
import { Game } from "./../Game";
import { TeamCore } from "./../core/Team.Core";
import { SoundManager } from "./../managers/Sound.Manager";
import { TeamManager } from "./../managers/Team.Manager";

//

class UIInGameModule {

    public opened: boolean = false;
    private hideGlobalLabelTimeout: any;

    //

    public init () {

        $('#viewport-graphics-quality').click( UI.changeQuality.bind( UI ) );
        $('#viewport-sound').click( UI.changeSound.bind( UI ) );
        $('#viewport-fullscreen').click( UI.toggleFullscreenMode.bind( UI ) );
        $('#viewport-help').click( UI.showHelp.bind( UI ) );

    };

    public refreshAds () {

        window['googletag'].pubads().refresh();

    };

    public updateTankStat ( event: MouseEvent | string ) {

        if ( ! Arena.me.tank || Arena.me.tank.health <= 0 ) return;

        let statName = ( typeof event === 'string' ) ? event : event.currentTarget!['parentNode'].className.replace( 'bonus ', '' );
        Arena.me.updateStats( statName );
        Arena.me.bonusLevels --;
        SoundManager.playSound('MenuClick');
        this.hideTankStatsUpdate();

        //

        if ( Arena.me.bonusLevels > 0 ) {

            this.showTankStatsUpdate( Arena.me.bonusLevels );

        }

    };

    public showLevelIndicator () {

        $('.level-indicator-block').show();
        UI.Chat.hideChatMessageInput();

    };

    public hideLevelIndicator () {

        $('.level-indicator-block').hide();

    };

    public showTankStatsUpdate ( bonusLevels: number ) {

        if ( Arena.me.tank && Arena.me.tank.health <= 0 ) return;

        $('.stats-update-block .bonus .increase').off();
        $( document ).unbind( 'keypress' );

        $('.stats-update-block').show();
        $('.stats-update-block').attr('opened', 'true');
        $('.chat .message-block-separate').hide();
        this.hideLevelIndicator();
        $('.stats-update-block .title').html( 'You have ' + bonusLevels + ' bonus levels.' );
        $('.stats-update-block .bonus .increase').click( this.updateTankStat.bind( this ) );
        UI.Chat.hideChatMessageInput();

        $( document ).bind( 'keypress', this.statsUpdateByKey.bind( this ) );

    };

    public hideTankStatsUpdate () {

        $('.stats-update-block').hide();
        $('.chat .message-block-separate').show();
        $('.stats-update-block').attr('opened', 'false');
        this.showLevelIndicator();
        $( document ).unbind( 'keypress' );

    };

    private statsUpdateByKey ( event: KeyboardEvent ) {

        switch ( event.keyCode ) {

            case 49:

                this.updateTankStat('speed');
                break;

            case 50:

                this.updateTankStat('rpm');
                break;

            case 51:

                this.updateTankStat('armour');
                break;

            case 52:

                this.updateTankStat('gun');
                break;

            case 53:

                this.updateTankStat('ammoCapacity');
                break;

        }

    };

    public updateLevelProgress () {

        let levels = [ 0, 10, 30, 60, 100, 150, 250, 340, 500, 650, 1000, 1400, 1900, 2500, 3000, 3800, 4500, 5500, 6700, 7200, 8700, 9800, 12000 ];
        let level = 0;

        while ( levels[ level ] <= Arena.me.score ) {

            level ++;

        }

        level --;

        let levelProgress = 100 * ( Arena.me.score - levels[ level ] ) / ( levels[ level + 1 ] - levels[ level ] );
        $('.level-indicator-block .title').html( 'Level ' + ( level + 1 ) + ' <sup style="font-size: 12px">' + Math.floor( levelProgress ) + '%</sup>' );
        $('.level-indicator-block .progress-bar .progress-indicator').css( 'width', levelProgress + '%' );

    };

    public showContinueBox ( username: string, color: string ) {

        this.hideTankStatsUpdate();
        this.hideLevelIndicator();

        $('#viewport #renderport').addClass('dead');

        $('#continue-box-wrapper #continue-btn').off();
        $('#continue-box-wrapper #continue-btn').click( () => {

            Arena.me.triggerRespawn();

        });

        $('#continue-box-wrapper').show();
        $('#continue-box-wrapper #continue-box-wrapper-title').html('<p>Killed by <span style="color:'+ color + '">' + username +'</span></p>');
        $('#continue-box-wrapper #change-tank').click( Game.garage.show.bind( Game.garage ) );

        setTimeout( () => {

            $('#continue-box-wrapper').css( 'opacity', 1 );

        }, 100 );

    };

    public hideContinueBox () {

        $('#viewport #renderport').removeClass('dead');
        $('#continue-box-wrapper').css( 'opacity', 0 );
        this.showLevelIndicator();

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

    public showKills ( killerId: number, killer: string, killed: string, killerColor: string, killedColor: string ) {

        $('#kill-events').append( '<p><span style="font-weight: bold; color:' + killerColor + '">' + killer +'</span> killed <span style="font-weight: bold; color:' + killedColor + '">' + killed + '</span>!</p>');

        if ( $('#kill-events').children().length > 5 ) {

            $('#kill-events p').first().remove();

        }

        if ( killerId === Arena.me.id ) {

            this.setGlobalLabel( 'Fu.. You killed <span style="color:' + killedColor + '">' + killed + '</span>!!' );

        }

    };

    public updateLeaderboard ( players: any[] ) {

        let me = Arena.me;
        let names = $('#top-killers .player-name');
        let kills = $('#top-killers .kills');
        let teams = $('#top-killers .players-team-image');
        let rows = $('#top-killers .killer-outer');
        let meInTop = false;

        rows.removeClass('myplace');

        for ( let i = 0; i < 5; i ++ ) {

            if ( i < players.length ) {

                $( names[ i ] ).html( players[ i ].login );
                $( kills[ i ] ).html( players[ i ].score + '/' + players[ i ].kills );
                $( teams[ i ] ).css( 'background-color', OMath.intToHex( TeamCore.colors[ players[ i ].team ] ) );
                $( rows[ i ] ).show();

                if ( me && players[ i ].id === me.id ) {

                    $( rows[ i ] ).addClass('myplace');
                    meInTop = true;
                    me.score = players[ i ].score;
                    me.kills = players[ i ].kills;

                }

            } else {

                $( rows[ i ] ).hide();

            }

        }

        //

        if ( ! meInTop ) {

            let rank = 0;

            for ( let i = 0, il = players.length; i < il; i ++ ) {

                if ( me && players[ i ].id === me.id ) {

                    rank = i + 1;
                    me.score = players[ i ].score;
                    me.kills = players[ i ].kills;
                    break;

                }

            }

            if ( rank === 0 ) return;

            $('#top-killers .killer-outer.last .player-counter').html( '#' + rank );
            $('#top-killers .killer-outer.last .player-name').html( me.username );
            $('#top-killers .killer-outer.last .kills').html( me.score + '/' + me.kills );
            $('#top-killers .killer-outer.last .players-team-image').css( 'background-color', OMath.intToHex( me.team.color ) );

            $('#top-killers #divider').show();
            $('#top-killers .killer-outer.last').show();
            $('#top-killers .killer-outer.last').addClass('myplace');

        } else {

            $('#top-killers #divider').hide();
            $('#top-killers .killer-outer.last').hide();

        }

        this.updateLevelProgress();

    };

    public updateTeamScore ( teams: any[] ) {

        let list = $( '#team-params .team-number' );

        for ( let i = 0, il = list.length; i < il; i ++ ) {

            $( list[ i ] ).html( teams[ i ].score + '%' );

        }

    };

    public showViewport () {

        $('#viewport').show();
        this.opened = true;

    };

    public showKillSerie ( playerId: number, playerLogin: string, playerTeamId: number, serieLength: number ) {

        let team = TeamManager.getById( playerTeamId );
        let serieNames = { 2: 'DOUBLE-KILL', 3: 'TRIPPLE-KILL', 10: 'MONSTER-KILL' };
        let serieName = serieNames[ serieLength ];

        if ( playerId !== Arena.me.id && team ) {

            $('#kill-events').append( '<p><span style="font-weight: bold; color:' + OMath.intToHex( team.color ) + '">' + playerLogin +'</span> made a <b>' + serieName + '</b></span>!</p>');

            if ( $('#kill-events').children().length > 5 ) {

                $('#kill-events p').first().remove();

            }

        } else {

            this.setGlobalLabel( 'You made <span style="color: #c44;">' + serieName + '</span>!' );

        }

    };

    public setGlobalLabel ( text: string ) {

        clearTimeout( this.hideGlobalLabelTimeout );
        $('#viewport .global-top-label').stop();
        $('#viewport .global-top-label').animate({ opacity: 1 }, 200 );
        $('#viewport .global-top-label').html( text );

        this.hideGlobalLabelTimeout = setTimeout( function () {

            $('#viewport .global-top-label').animate({ opacity: 0 }, 500 );

        }, 2000 );

    };

    public updateFPS ( value: number ) {

        $('.fps-value').html( value.toString() );

    };

    public updatePing ( value: number ) {

        $('.ping-value').html( value.toString() );

    };

};

//

export { UIInGameModule };
