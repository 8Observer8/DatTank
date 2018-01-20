/*
 * @author ohmed
 * DatTank UI file
*/

'use strict';

Game.UI = function () {

    // nothing here

};

Game.UI.prototype.init = function () {

    if ( localStorage.getItem('hq') === 'true' ) {

        this.chageQuality( true, true );

    }

    if ( localStorage.getItem('sound') === 'true' ) {

        this.changeSound( true, true );

    }

    $('#settings-wrapper').hide();

    localStorage.setItem( 'gear', false );

    setTimeout( function () { $('.fb-like').animate( { opacity: 1 }, 500 ); }, 1000 );
    setTimeout( function () { $('.folow-btn').animate( { opacity: 1 }, 500 ); }, 1200 );

};

Game.UI.prototype.chageQuality = function ( value, withoutSound ) {

    value = ( typeof value === 'boolean' ) ? value : $( value.currentTarget ).attr('hq') !== 'true';
    $('#graphics-quality').attr( 'hq', value );
    $('#viewport-graphics-quality').attr( 'hq', value );
    localStorage.setItem( 'hq', value );

    view.updateRenderer();

    if ( ! withoutSound ) {

        soundManager.playMenuSound();

    }

};

Game.UI.prototype.changeSound = function ( value, withoutSound ) {

    value = ( typeof value === 'boolean' ) ? value : $( value.currentTarget ).attr('sound') !== 'true';
    $('#sound-on-off').attr( 'sound', value );
    $('#viewport-sound-on-off').attr( 'sound', value );
    localStorage.setItem( 'sound', value );

    if ( ! withoutSound ) {

        soundManager.playMenuSound();

    }

};

Game.UI.prototype.hideSignInPopup = function () {

    $('#signin-box-wrapper').hide();
    $('#graphics-quality').hide();
    $('#sound-on-off').hide();
    $('#share-btn').hide();
    $('.top-left-like-btns').hide();

};

Game.UI.prototype.openSettings = function (value) {

    value = ( typeof value === 'boolean' ) ? value : $('#gear_btn').attr('gear') !== 'true';
    $('#gear_btn').attr( 'gear', value );
    localStorage.setItem( 'gear', value );
    soundManager.playMenuSound();

    if ( localStorage.getItem( 'gear' ) === 'true' ) {

        $('#settings-wrapper').show();

    }

    if ( localStorage.getItem( 'gear' ) === 'false' ){

        $('#settings-wrapper').hide();

    }

};

Game.UI.prototype.toggleLeaderboard = function () {

    $('#leaderboard-wrapper').toggle();

};

Game.UI.prototype.hideFooter = function () {

    $('#footer').hide();

};

Game.UI.prototype.showViewport = function () {

    $('#viewport').show();

};

Game.UI.prototype.setCursor = function () {

    $('#viewport').addClass('properCursor');

};

Game.UI.prototype.updateHealth = function ( value ) {

    $('#health-number').html( value );
    $('#empty-health-image').css( 'height', ( 100 - value ) + '%' );

};

Game.UI.prototype.updateAmmo = function ( value ) {

    $('#ammo-number').html( value );

};

Game.UI.prototype.showContinueBox = function ( playerlogin, playerColor ) {

    $('#continue-box-wrapper #continue-btn').off();

    $('#continue-box-wrapper #continue-btn').click( function () {

        Game.arena.me.respawn( false );

    });

    $('#continue-box-wrapper').show();
    $('#continue-box-wrapper #title').html('<p>Killed by <span style="color:'+ playerColor + '">' + playerlogin +'</span></p>');
    $('#continue-box-wrapper #change-tank').click( ui.showChoiceWindow.bind( ui ) );

    setTimeout( function () {

        $('#continue-box-wrapper').css( 'opacity', 1 );

    }, 100 );

};

Game.UI.prototype.showKills = function ( killer, killed ) {

    var killerName = ( killer instanceof Game.Tower ) ? 'Tower' : killer.login;

    $('#kill-events').append( '<p><span style="color:' + killer.team.color + '">' + killerName +'</span> killed <span style="color:' + killed.team.color + '">' + killed.login + '</span>!</p>');

    if ( $('#kill-events').children().length > 5 ) {

        $('#kill-events p').first().remove();

    }

};

Game.UI.prototype.clearKills = function () {

    $('#kill-events').html('');

};

Game.UI.prototype.hideContinueBox = function () {

    $('#continue-box-wrapper').css( 'opacity', 0 );

    setTimeout( function () {

        $('#continue-box-wrapper').hide();

    }, 200);

};

Game.UI.prototype.updateTeamScore = function ( teams ) {

    var list = $( '#team-params .team-number' );

    for ( var i = 0, il = list.length; i < il; i ++ ) {

        $( list[ i ] ).html( teams[ i ].score + '%' );

    }

};

Game.UI.prototype.updateLeaderboard = function ( players, me ) {

    var names = $('#top-killers .player-name');
    var kills = $('#top-killers .kills');
    var teams = $('#top-killers .players-team-image');

    var rows = $('#top-killers .killer-outer');

    rows.removeClass('myplace');

    var meInTop = false;

    for ( var i = 0; i < 5; i ++ ) {

        if ( i < players.length ) {

            $( names[ i ] ).html( players[ i ].login );
            $( kills[ i ] ).html( players[ i ].kills );
            $( teams[ i ] ).css( 'background-color', players[ i ].team.color );

            $( rows[ i ] ).show();

            if ( me && players[ i ].id === me.id ) {

                $( rows[ i ] ).addClass('myplace');
                meInTop = true;

            }

        } else {

            $( rows[ i ] ).hide();

        }

    }

    //

    if ( ! meInTop ) {

        var rank = 0;

        for ( var i = 0, il = players.length; i < il; i ++ ) {

            if ( me && players[ i ].id === me.id ) {

                rank = i + 1;
                break;

            }

        }

        if ( rank === 0 ) return;

        $('#top-killers .killer-outer.last .player-counter').html( '#' + rank );
        $('#top-killers .killer-outer.last .player-name').html( me.login );
        $('#top-killers .killer-outer.last .kills').html( me.kills );
        $('#top-killers .killer-outer.last .players-team-image').css( 'background-color', me.team.color );

        $('#top-killers #divider').show();
        $('#top-killers .killer-outer.last').show();

    } else {

        $('#top-killers #divider').hide();
        $('#top-killers .killer-outer.last').hide();

    }

};

Game.UI.prototype.showLoaderScreen = function () {

    $('#loader-wrapper').show();

    setTimeout( function () {

        $('#loader-wrapper').css( 'opacity', 1 );

    }, 50 );

};

Game.UI.prototype.hideLoaderScreen = function () {

    setTimeout( function () {

        $('#loader-wrapper').hide();

    }, 200 );

    $('#loader-wrapper').css( 'opacity', 0 );

};

Game.UI.prototype.showChoiceWindow = function () {

    $('.tank-skins').show();
    $('#signin-box').css('opacity', 0);

    garage.selectTank();
    soundManager.playMenuSound();

};

Game.UI.prototype.closeChoiceWindow = function ( event ) {

    if ( event ) {

        event.stopPropagation();

    }

    $('.tank-skins').hide();
    $('#signin-box').css('opacity', 1);
    garage.stop();

};

Game.UI.prototype.selectTankAndcloseChoiceWindow = function () {

    if ( localStorage.getItem( 'currentTank' ) === 'D32' && localStorage.getItem( 'unblockedTank' ) !== 'true' ) {

        $('.share-label').show();

    } else {

        $('.tank-skins').hide();

    }

    $('#signin-box').css('opacity', 1);
    garage.pickTank();
    garage.stop();

};
