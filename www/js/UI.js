/*
 * @author ohmed
 * DatTank UI file
*/

'use strict';

DT.UI = function () {

    // nothing here

};

DT.UI.prototype.hideSignInPopup = function () {

    Utils.ge('#signin-box-wrapper').style['display'] = 'none';

};

DT.UI.prototype.hideFooter = function () {

    Utils.ge('#footer').style['display'] = 'none';

};

DT.UI.prototype.showViewport = function () {

    Utils.ge('#viewport').style['display'] = 'block';

};

DT.UI.prototype.setCursor = function () {

    Utils.ge('#viewport').className += 'properCursor';

};

DT.UI.prototype.updateHealth = function ( value ) {

    Utils.ge('#health-number').innerHTML = value;
    Utils.ge('#empty-health-image').style['height'] = ( 100 - value ) + '%';

};

DT.UI.prototype.updateAmmo = function ( value ) {

    Utils.ge('#ammo-number').innerHTML = value;

};

DT.UI.prototype.showContinueBox = function () {

    Utils.ge('#continue-box-wrapper #continue-btn').onclick = DT.arena.me.respawn.bind( DT.arena.me, false );

    Utils.ge('#continue-box-wrapper').style['display'] = 'block';

    setTimeout( function () {

        Utils.ge('#continue-box-wrapper').style['opacity'] = 1;

    }, 100 );

};

DT.UI.prototype.showKills = function ( killer, killed ) {

    Utils.ge('#kill-events').innerHTML += '<p><span style="color:' + DT.Team.colors[ killer.team ]+ '">' + killer.login +'</span> killed <span style="color:' + DT.Team.colors[ killed.team ]+ '">' + killed.login + '</span>!</p>';

    if ( Utils.ge('#kill-events').childNodes.length > 5 ) {

        Utils.ge('#kill-events').firstChild.remove();

    }

};

DT.UI.prototype.showWinners = function ( winner ) {

    Utils.ge('#winners #play-button').onclick = function () {

        Utils.ge('#winners').style['display'] = 'none';

        if ( ! network.send( 'joinArena', { login: localStorage.getItem('login') || '' }, core.joinArena ) ) {

            // :(

            return;

        }

    };

    Utils.ge('#winners #team-color').style['background-color'] = DT.Team.colors[ winner ];
    Utils.ge('#continue-box-wrapper').style['display'] = 'none';
    Utils.ge('#winners').style['display'] = 'block';

    setTimeout( function () {

        Utils.ge('#winners').style['opacity'] = 1;

    }, 100 );

};

DT.UI.prototype.hideContinueBox = function () {

    Utils.ge('#continue-box-wrapper').style['opacity'] = 0;

    setTimeout( function () {

        Utils.ge('#continue-box-wrapper').style['display'] = 'none';

    }, 200);

};

DT.UI.prototype.hideWinners = function () {

    Utils.ge('#winners').style['opacity'] = 0;

    setTimeout( function () {

        Utils.ge('#winners').style['display'] = 'none';

    }, 200);

};

DT.UI.prototype.updateTeamScore = function ( teams ) {

    var list = Utils.ges( '#team-params .team-number' );

    for ( var i = 0, il = list.length; i < il; i ++ ) {

        list[ i ].innerHTML = teams[ i ].kills;

    }

};

DT.UI.prototype.updateLeaderboard = function ( players, me ) {

    players.sort( function ( a, b ) { return ( b.kills - a.kills ); });

    var names = Utils.ges('#top-killers .player-name');
    var kills = Utils.ges('#top-killers .kills');
    var team = Utils.ges('#top-killers .players-team-image');

    var row = Utils.ges('#top-killers .killer-outer');

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

            row[ i ].style['display'] = 'none';

        }

    }

    for ( var i = 9; i >= players.length; i -- ) {

        row[ i ].style['display'] = 'none';

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

        Utils.ge('#arena-time #time').style['color'] = 'red';
        setTimeout( function () {

            Utils.ge('#arena-time #time').style['color'] = 'burlywood';

        }, 500 );

    }

    //

    Utils.ge('#arena-time #time').innerHTML = minutes + ':' + seconds;

};

DT.UI.prototype.showLoaderScreen = function () {

    Utils.ge('#loader-wrapper').style['display'] = 'block';

    setTimeout( function () {

        Utils.ge('#loader-wrapper').style['opacity'] = 1;

    }, 50 );

};

DT.UI.prototype.hideLoaderScreen = function () {

    setTimeout( function () {

        Utils.ge('#loader-wrapper').style['display'] = 'none';

    }, 200 );

    Utils.ge('#loader-wrapper').style['opacity'] = 0;

};
