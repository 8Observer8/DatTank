/*
 * @author ohmed
 * DatTank In Game UI module
*/

import * as OMath from '../OMath/Core.OMath';
import { Arena } from '../core/Arena.Core';
import { UI } from '../ui/Core.UI';
import { Game } from '../Game';
import { TeamCore } from '../core/Team.Core';
import { TeamManager } from '../managers/Team.Manager';
import { UITankUpgrade } from './TankUpgrade.UI';

//

export class UIInGameModule {

    public opened: boolean = false;
    private hideGlobalLabelTimeout: any;

    public tankUpgradeMenu: UITankUpgrade = new UITankUpgrade();

    //

    public init () : void {

        $('#viewport .graphics-quality').click( UI.changeQuality.bind( UI ) );
        $('#viewport .sound').click( UI.changeSound.bind( UI ) );
        $('#viewport .fullscreen').click( UI.toggleFullscreenMode.bind( UI ) );
        $('#viewport .help').click( UI.showHelp.bind( UI ) );

    };

    public refreshAds () : void {

        window['googletag'].pubads().refresh();

    };

    public showContinueBox ( username: string, color: string ) : void {

        this.tankUpgradeMenu.hideUpgradeMenu();
        this.tankUpgradeMenu.hideProgressIndicator();

        $('#viewport #renderport').addClass('dead');

        $('#continue-box-wrapper #continue-btn').off();
        $('#continue-box-wrapper #continue-btn').click( () => {

            Arena.me.triggerRespawn();

        });

        $('#continue-box-wrapper').show();
        $('#continue-box-wrapper #continue-box-wrapper-title').html('<p>Killed by <span style="color:' + color + '">' + username + '</span></p>');
        $('#continue-box-wrapper #change-tank').click( Game.garage.show.bind( Game.garage ) );

        setTimeout( () => {

            $('#continue-box-wrapper').css( 'opacity', 1 );

        }, 100 );

    };

    public hideContinueBox () : void {

        $('#viewport #renderport').removeClass('dead');
        $('#continue-box-wrapper').css( 'opacity', 0 );
        this.tankUpgradeMenu.showProgressIndicator();

        setTimeout( () => {

            $('#continue-box-wrapper').hide();

        }, 200);

    };

    public showDisconnectMessage () : void {

        $('.disconnect-warning').show();

    };

    public updateHealth ( value: number ) : void {

        $('#health-number').html( value + '' );
        $('#empty-health-image').css( 'height', ( 100 - value ) + '%' );

    };

    public updateAmmo ( value: number ) : void {

        $('#ammo-number').html( value + '' );

    };

    public setAmmoReloadAnimation ( duration: number ) : void {

        const element = $('#empty-ammo-image');
        // -> removing the class
        element.removeClass('ammo-animation');
        element.css( 'height', '100%' );

        // -> triggering reflow / The actual magic /
        // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
        // const test = element[0].offsetWidth === 1;
        element.css( 'background-image', 'url(../resources/img/ammo.png)' );

        // -> and re-adding the class
        element.addClass('ammo-animation');
        element.css( 'animation-duration', 1.2 * duration + 'ms' );

    };

    public showKills ( killerId: number, killer: string, killed: string, killerColor: string, killedColor: string ) : void {

        $('#kill-events').append( '<p><span style="font-weight: bold; color:' + killerColor + '">' + killer + '</span> killed <span style="font-weight: bold; color:' + killedColor + '">' + killed + '</span>!</p>');

        if ( $('#kill-events').children().length > 5 ) {

            $('#kill-events p').first().remove();

        }

        if ( killerId === Arena.me.id ) {

            this.setGlobalLabel( 'Fu.. You killed <span style="color:' + killedColor + '">' + killed + '</span>!!' );

        }

    };

    public updateLeaderboard ( players: any[] ) : void {

        const me = Arena.me;
        const names = $('#top-killers .player-name');
        const kills = $('#top-killers .kills');
        const teams = $('#top-killers .players-team-image');
        const rows = $('#top-killers .killer-outer');
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

        this.tankUpgradeMenu.updateProgressIndicator();

    };

    public updateTeamScore ( teams: any[] ) : void {

        const list = $( '#team-params .team-number' );

        for ( let i = 0, il = list.length; i < il; i ++ ) {

            $( list[ i ] ).html( teams[ i ].score + '%' );

        }

    };

    public showViewport () : void {

        $('#viewport').show();
        this.opened = true;

    };

    public showKillSerie ( playerId: number, playerLogin: string, playerTeamId: number, serieLength: number ) : void {

        const team = TeamManager.getById( playerTeamId );
        const serieNames = { 2: 'DOUBLE-KILL', 3: 'TRIPLE-KILL', 10: 'MONSTER-KILL' };
        const serieName = serieNames[ serieLength ];

        if ( playerId !== Arena.me.id && team ) {

            $('#kill-events').append( '<p><span style="font-weight: bold; color:' + OMath.intToHex( team.color ) + '">' + playerLogin + '</span> made a <b>' + serieName + '</b></span>!</p>');

            if ( $('#kill-events').children().length > 5 ) {

                $('#kill-events p').first().remove();

            }

        } else {

            this.setGlobalLabel( 'You made <span style="color: #c44;">' + serieName + '</span>!' );

        }

    };

    public setGlobalLabel ( text: string ) : void {

        clearTimeout( this.hideGlobalLabelTimeout );
        $('#viewport .global-top-label').stop();
        $('#viewport .global-top-label').animate({ opacity: 1 }, 200 );
        $('#viewport .global-top-label').html( text );

        this.hideGlobalLabelTimeout = setTimeout( () => {

            $('#viewport .global-top-label').animate({ opacity: 0 }, 500 );

        }, 2000 );

    };

    public updateCoins ( coins: number ) : void {

        $('#viewport .stats-block .coins .value').html( coins.toString() );

    };

    public updateFPS ( value: number ) : void {

        $('.fps-value').html( value.toString() );

    };

    public updatePing ( value: number ) : void {

        $('.ping-value').html( value.toString() );

    };

};
