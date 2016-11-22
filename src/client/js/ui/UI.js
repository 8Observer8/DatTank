/*
 * @author ohmed
 * DatTank UI file
*/

'use strict';

DT.UI = function () {

    // nothing here

};

DT.UI.prototype.init = function () {

    if ( localStorage.getItem('hq') === 'true' ) {

        this.chageGameQuality( true );

    }

    if ( localStorage.getItem('sound') === 'true' ) {

        this.changeSound( true );

    }

    $('#settings-wrapper').hide();

    localStorage.setItem( 'gear', false );

    setTimeout( function () { $('.fb-like').animate( { opacity: 1 }, 500 ); }, 1000 );
    setTimeout( function () { $('.folow-btn').animate( { opacity: 1 }, 500 ); }, 1200 );

};

DT.UI.prototype.chageGameQuality = function ( value ) {

    value = ( typeof value === 'boolean' ) ? value : $('#graphics-quality').attr('hq') !== 'true';
    $('#graphics-quality').attr( 'hq', value );
    localStorage.setItem( 'hq', value );

    soundSys.playMenuSound();

};

DT.UI.prototype.changeSound = function ( value ) {

    value = ( typeof value === 'boolean' ) ? value : $('#sound-on-off').attr('sound') !== 'true';
    $('#sound-on-off').attr( 'sound', value );
    localStorage.setItem( 'sound', value );

    soundSys.playMenuSound();

};

DT.UI.prototype.hideSignInPopup = function () {

    $('#signin-box-wrapper').hide();
    $('#graphics-quality').hide();
    $('#sound-on-off').hide();
    $('#share-btn').hide();
    $('.top-left-like-btns').hide();

};

DT.UI.prototype.openSettings = function (value) {

    value = ( typeof value === 'boolean' ) ? value : $('#gear_btn').attr('gear') !== 'true';
    $('#gear_btn').attr( 'gear', value );
    localStorage.setItem( 'gear', value );
    soundSys.playMenuSound();

    if ( localStorage.getItem( 'gear' ) === 'true' ) {

        $('#settings-wrapper').show();

    }

    if ( localStorage.getItem( 'gear' ) === 'false' ){

        $('#settings-wrapper').hide();

    }

};

DT.UI.prototype.toggleLeaderboard = function () {

    $('#leaderboard-wrapper').toggle();

};

DT.UI.prototype.hideFooter = function () {

    $('#footer').hide();

};

DT.UI.prototype.showViewport = function () {

    $('#viewport').show();

};

DT.UI.prototype.setCursor = function () {

    $('#viewport').addClass('properCursor');

};

DT.UI.prototype.updateHealth = function ( value ) {

    $('#health-number').html( value );
    $('#empty-health-image').css( 'height', ( 100 - value ) + '%' );

};

DT.UI.prototype.updateAmmo = function ( value ) {

    $('#ammo-number').html( value );

};

DT.UI.prototype.showContinueBox = function ( playerlogin, playerColor ) {

    $('#continue-box-wrapper #continue-btn').off();
    $('#continue-box-wrapper #continue-btn').click( DT.arena.me.respawn.bind( DT.arena.me, false ) );
    $('#continue-box-wrapper').show();
    $('#continue-box-wrapper #title').html('<p>Killed by <span style="color:'+ playerColor + '">' + playerlogin +'</span></p>');

    setTimeout( function () {

        $('#continue-box-wrapper').css( 'opacity', 1 );

    }, 100 );

};

DT.UI.prototype.showKills = function ( killer, killed ) {

    $('#kill-events').append( '<p><span style="color:' + DT.Team.colors[ killer.team ]+ '">' + killer.login +'</span> killed <span style="color:' + DT.Team.colors[ killed.team ]+ '">' + killed.login + '</span>!</p>');

    if ( $('#kill-events').children().length > 5 ) {

        $('#kill-events p').first().remove();

    }

};

DT.UI.prototype.clearKills = function () {

    $('#kill-events').html('');

};

DT.UI.prototype.showWinners = function ( winner ) {

    $('#winners #play-button').off();
    $('#winners #play-button').click( function () {

        $('#winners').hide();

        var tank = localStorage.getItem( 'currentTank' ) || 0;

        if ( ! network.send( 'joinArena', { login: localStorage.getItem('login') || '', tank: tank }, core.joinArena ) ) {

            // :(

            return;

        }

    });

    $('#winners #team-color').css( 'background-color', DT.Team.colors[ winner ] );
    $('#continue-box-wrapper').hide();
    $('#winners').show();

    setTimeout( function () {

        $('#winners').css( 'opacity', 1 );

    }, 100 );

};

DT.UI.prototype.hideContinueBox = function () {

    $('#continue-box-wrapper').css( 'opacity', 0 );

    setTimeout( function () {

        $('#continue-box-wrapper').hide();

    }, 200);

};

DT.UI.prototype.hideWinners = function () {

    $('#winners').css( 'opacity', 0 );

    setTimeout( function () {

        $('#winners').hide();

    }, 200);

};

DT.UI.prototype.updateTeamScore = function ( teams ) {

    var list = $( '#team-params .team-number' );

    for ( var i = 0, il = list.length; i < il; i ++ ) {

        $( list[ i ] ).html( teams[ i ].kills );

    }

};

DT.UI.prototype.updateLeaderboard = function ( players, me ) {

    players.sort( function ( a, b ) { return ( b.kills - a.kills ); });

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
            $( teams[ i ] ).css( 'background-color', DT.Team.colors[ players[ i ].team ] );

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
        $('#top-killers .killer-outer.last .players-team-image').css( 'background-color', DT.Team.colors[ me.team ] );

        $('#top-killers #divider').show();
        $('#top-killers .killer-outer.last').show();

    } else {

        $('#top-killers #divider').hide();
        $('#top-killers .killer-outer.last').hide();

    }

};

DT.UI.prototype.updateArenaTime = function ( time ) {

    var matchTime = 300;

    var seconds = 59 - ( time % 60 );
    if ( seconds < 10 ) seconds = '0' + seconds;

    var minutes = Math.floor( matchTime / 60 ) - Math.floor( time / 60 ) - 1;
    if ( minutes < 0 ) return;
    if ( minutes < 10 ) minutes = '0' + minutes;

    //

    if ( minutes === '00' && + seconds < 30 ) {

        $('#arena-time #time').css( 'color', 'red' );
        setTimeout( function () {

            $('#arena-time #time').css( 'color', 'burlywood' );

        }, 500 );

    }

    //

    $('#arena-time #time').html( minutes + ':' + seconds );

};

DT.UI.prototype.showLoaderScreen = function () {

    $('#loader-wrapper').show();

    setTimeout( function () {

        $('#loader-wrapper').css( 'opacity', 1 );

    }, 50 );

};

DT.UI.prototype.hideLoaderScreen = function () {

    setTimeout( function () {

        $('#loader-wrapper').hide();

    }, 200 );

    $('#loader-wrapper').css( 'opacity', 0 );

};

DT.UI.prototype.showChoiceWindow = function () {

    $(".tank-skins").show();
    $("#signin-box").css("opacity", 0);
    garage.init();

};

DT.UI.prototype.closeChoiceWindow = function ( event ) {

    if ( event ) {

        event.stopPropagation();

    }

    $(".tank-skins").hide();
    $("#signin-box").css("opacity", 1); 
    garage.stop();

};

DT.UI.prototype.selectTankAndcloseChoiceWindow = function () {

    $(".tank-skins").hide();
    $("#signin-box").css("opacity", 1);
    garage.pickTank();
    garage.stop();
 
};
