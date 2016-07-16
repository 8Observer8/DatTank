/*
 * @author ohmed
 * DatTank core file
*/

'use strict';

DT.Core = function () {

    this.arena = false;

};

DT.Core.prototype.init = function () {

    ui.init();

    var login = Utils.ge('#username').value || localStorage.getItem('login') || '';
    Utils.ge('#username').value = login;

    // add handlers

    Utils.ge('#signin-box #username').focus();
    Utils.ge('#play-btn').addEventListener( 'click', this.play.bind( this ) );

    $('#graphics-quality').click( ui.chageGameQuality.bind( ui ) );

};

DT.Core.prototype.play = function ( event ) {

    var scope = this;

    soundSys.playMenuSound();
    event.preventDefault();

    //

    ui.showLoaderScreen();

    resourceManager.load( function ( progress ) {

        Utils.ge('#loader-wrapper #progress-wrapper #progress-bar').style['width'] = ( 100 * progress ) + '%';
        Utils.ge('#loader-wrapper #title span').innerHTML = Math.round( 100 * progress ) + '%';

    }, function () {

        // init controls

        controls.clear();
        controls.mouseInit();
        controls.keyInit();

        // init network

        network.init();

        // free prev arena if still exists

        if ( scope.arena !== false ) {

            scope.arena.dispose();
            scope.arena = false;

        }

        // send network request

        var login = Utils.ge('#username').value || localStorage.getItem('login') || '';
        localStorage.setItem( 'login', login );

        ga('send', {
            hitType: 'event',
            eventCategory: 'game',
            eventAction: 'play'
        });

        setTimeout( function () { network.send( 'joinArena', { login: login } ); }, 1000 );

        // UI changes

        ui.hideSignInPopup();
        ui.hideFooter();
        ui.showViewport();
        ui.setCursor();

        ui.hideLoaderScreen();

    });

};

DT.Core.prototype.joinArena = function ( params ) {

    view.clean();
    view.setupScene();
    view.addMap();
    view.addTeamZone();

    //

    if ( DT.arena && DT.arena.pingInterval ) clearInterval( DT.arena.pingInterval );

    DT.arena = new DT.Arena();
    DT.arena.init( params );

    DT.arena.pingInterval = setInterval( network.send.bind( network, 'ping' ), 15000 );

    // change camera position

    view.camera.position.set( DT.arena.me.position.x + 180, 400, DT.arena.me.position.z );
    view.camera.lookAt( DT.arena.me.position );

    view.sunLight.position.set( DT.arena.me.position.x - 100, view.sunLight.position.y, DT.arena.me.position.z + 100 );
    view.sunLight.target.position.set( DT.arena.me.position.x, 0, DT.arena.me.position.z );
    view.sunLight.target.updateMatrixWorld();

    ui.updateLeaderboard( DT.arena.players, DT.arena.me );

};

// init services

var core = new DT.Core();
var ui = new DT.UI();
var network = new DT.Network();
var view = new DT.View();
var controls = new DT.Controls();
var resourceManager = new DT.ResourceManager();
var soundSys = new DT.SoundSys();

// page loaded

document.addEventListener( 'DOMContentLoaded', core.init.bind( core ), false );
