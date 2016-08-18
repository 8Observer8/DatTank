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

DT.UI.prototype.showContinueBox = function () {

    $('#continue-box-wrapper #continue-btn').click( DT.arena.me.respawn.bind( DT.arena.me, false ) );
    $('#continue-box-wrapper').show();

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

    $('#winners #play-button').click( function () {

        $('#winners').hide();

        if ( ! network.send( 'joinArena', { login: localStorage.getItem('login') || '' }, core.joinArena ) ) {

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
    var team = $('#top-killers .players-team-image');

    var row = $('#top-killers .killer-outer');

    for ( var i = 0, il = Math.min( players.length, 9 ); i < il; i ++ ) {

        names[ i ].innerHTML = players[ i ].login;
        kills[ i ].innerHTML = players[ i ].kills;
        team[ i ].style['background-color'] = DT.Team.colors[ players[ i ].team ];

        row[ i ].style['display'] = 'block';
        row[ i ].classList.remove('myplace');

    }

    for ( var i = Math.min( players.length - 1, 9 ); i > 9; i -- ) {

        if ( players[ i ].id === me ) {

            row[ i ].classList.add('myplace');

        } else {

            $( row[ i ] ).hide();

        }

    }

    for ( var i = 9; i >= players.length; i -- ) {

        $( row[ i ] ).hide();

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
    chooseSkin.init(); 

};

DT.UI.prototype.closeChoiceWindow = function () {

    $(".tank-skins").hide();
    $("#signin-box").css("opacity", 1); 
    chooseSkin.stop();
    
};

DT.UI.prototype.selectTankAndcloseChoiceWindow = function () {

    $(".tank-skins").hide();
    $("#signin-box").css("opacity", 1);
    chooseSkin.stop();
 
};
