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

    var login = $('#username').val() || localStorage.getItem('login') || '';
    $('#username').val( login );

    // add handlers

    $('#signin-box #username').focus();
    $('#play-btn').click( this.play.bind( this ) );

    $('#graphics-quality').click( ui.chageGameQuality.bind( ui ) );
    $('#sound-on-off').click(ui.changeSound.bind( ui ) );
};

DT.Core.prototype.play = function ( event ) {

    var scope = this;

    soundSys.playMenuSound();
    event.preventDefault();

    //

    ui.showLoaderScreen();

    resourceManager.load( function ( progress ) {

        var value = Math.round( 100 * progress ) + '%';
        $('#loader-wrapper #progress-wrapper #progress-bar').css( 'width', value );
        $('#loader-wrapper #title span').html( value );

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

        var login = $('#username').val() || localStorage.getItem('login') || '';
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

    DT.arena = new DT.Arena();
    DT.arena.init( params );

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

$( document ).ready( core.init.bind( core ), false );
