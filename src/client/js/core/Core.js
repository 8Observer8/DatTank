/*
 * @author ohmed
 * DatTank core file
*/

'use strict';

DT.Core = function () {

    this.arena = false;

};

DT.Core.prototype.init = function () {

    window.ui = new DT.UI();
    window.network = new DT.Network();
    window.view = new DT.View();
    window.controls = new DT.Controls();
    window.resourceManager = new DT.ResourceManager();
    window.soundSys = new DT.SoundSys();
    window.garage = new DT.Garage();

    //

    ui.init();

    var login = $('#username').val() || localStorage.getItem('login') || '';
    $('#username').val( login );

    // add handlers

    $('#signin-box #username').focus();
    $('#play-btn').click( this.play.bind( this ) );
    $('.change-skin-btn').click( ui.showChoiceWindow.bind( ui ) );
    $('.close-tank-skins').click( ui.closeChoiceWindow.bind( ui ) );
    $('.btn-pick').click(ui.selectTankAndcloseChoiceWindow.bind( ui ) )

    $('#graphics-quality').click( ui.chageGameQuality.bind( ui ) );
    $('#sound-on-off').click( ui.changeSound.bind( ui ) );

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

        var tank = localStorage.getItem( 'selectedTank' ) || 0;

        setTimeout( function () { network.send( 'joinArena', { login: login, tank: tank } ); }, 1000 );

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

    $('#gear_btn').click( ui.openSettings.bind( ui ) );  
    $('#exit-btn').click( ui.openSettings.bind( ui ) );
    $('#soundon').click( ui.changeSound.bind( ui ) );
    $('#qualityon').click( ui.chageGameQuality.bind( ui ) );

};

// init services

var core = new DT.Core();

// page loaded

$( document ).ready( core.init.bind( core ), false );
