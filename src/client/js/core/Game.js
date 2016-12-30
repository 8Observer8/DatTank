/*
 * @author ohmed
 * DatTank game core file
*/

var Game = function () {

    this.arena = false;

};

Game.Version = '2dev';

Game.prototype = {};

Game.prototype.init = function () {

    var scope = this;

    window.ui = new Game.UI();
    window.garage = new Game.Garage();
    window.network = new Game.NetworkManager();
    window.view = new Game.ViewManager();
    window.controls = new Game.ControlsManager();
    window.resourceManager = new Game.ResourceManager();
    window.soundManager = new Game.SoundManager();
    window.settings = new Game.SettingsManager();

    //

    ui.init();

    var login = $('#username').val() || localStorage.getItem('login') || '';
    $('#username').val( login );

    // add handlers

    $('#signin-box #username').focus();
    $('#signin-box #username').keydown( function ( event ) {

        if ( event.keyCode === 13 ) {

            scope.play();

        }

    });
    $('#play-btn').click( this.play.bind( this ) );
    $('.change-skin-btn').click( ui.showChoiceWindow.bind( ui ) );
    $('.btn-pick').click(ui.selectTankAndcloseChoiceWindow.bind( ui ) );

    $('#graphics-quality').click( ui.chageQuality.bind( ui ) );
    $('#sound-on-off').click( ui.changeSound.bind( ui ) );

    $('#viewport-graphics-quality').click( ui.chageQuality.bind( ui ) );
    $('#viewport-sound-on-off').click( ui.changeSound.bind( ui ) );

};

Game.prototype.play = function ( event ) {

    var scope = this;

    if ( event ) {

        event.preventDefault();
        
    }

    Game.Ads.playAipPreroll( function () {

        soundManager.playMenuSound();

        //

        ui.showLoaderScreen();

        ui.hideSignInPopup();
        ui.hideFooter();

        resourceManager.load( function ( progress ) {

            var value = Math.round( 100 * progress ) + '%';
            $('#loader-wrapper #progress-wrapper #progress-bar').css( 'width', value );
            $('#loader-wrapper #title span').html( value );
            $('#crowd-shortcut').hide();

        }, function () {

            $('#loader-wrapper #progress-wrapper').hide();
            $('#loader-wrapper #title').html('Initializing arena...');

            // init controls

            controls.mouseInit();
            controls.keyInit();

            // init network

            network.init( function () {

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

                var tank = localStorage.getItem( 'currentTank' ) || 0;

                setTimeout( function () {

                    network.send( 'joinArena', { login: login, tank: tank } );

                }, 1000 );

                // UI changes

                ui.setCursor();

            });

        });

    });

};

Game.prototype.joinArena = function ( params ) {

    view.clean();
    view.setupScene();

    $('#crowd-shortcut').show();

    //

    Game.arena = new Game.Arena();
    Game.arena.init( params );

    //

    ui.showViewport();
    ui.hideLoaderScreen();

    //

    view.addMap();
    view.addTeamZone();

    // change camera position

    view.camera.position.set( Game.arena.me.position.x + 180, 400, Game.arena.me.position.z );
    view.camera.lookAt( Game.arena.me.position );

    view.sunLight.position.set( Game.arena.me.position.x - 100, view.sunLight.position.y, Game.arena.me.position.z + 100 );
    view.sunLight.target.position.set( Game.arena.me.position.x, 0, Game.arena.me.position.z );
    view.sunLight.target.updateMatrixWorld();

    ui.updateLeaderboard( Game.arena.playerManager.players, Game.arena.me );

    $('#gear_btn').click( ui.openSettings.bind( ui ) );  
    $('#exit-btn').click( ui.openSettings.bind( ui ) );
    $('#soundon').click( ui.changeSound.bind( ui ) );
    $('#qualityon').click( ui.chageQuality.bind( ui ) );

    $('#leaderboard').click( ui.toggleLeaderboard.bind( ui ) );

};
