/*
 * @author ohmed
 * DatTank game core file
*/

var Game = function () {

    this.arena = false;

    this.gameLoopInterval = false;
    this.prevLoopTime = false;
    this.loopTimeRemainder = 0;
    this.time = false;

    //

    this.isMobile = new MobileDetect( window.navigator.userAgent );
    this.isMobile = this.isMobile.mobile() || this.isMobile.phone() || this.isMobile.tablet();

};

Game.Version = '5dev';

Game.prototype = {};

//

Game.prototype.init = function () {

    if ( this.isMobile ) {

        $('.error-on-mobile').show();
        return;

    }

    var scope = this;

    window.ui = new Game.UI();
    window.garage = new Game.Garage();
    window.network = new Game.NetworkManager();
    window.view = new Game.ViewManager();
    window.controls = new Game.ControlsManager();
    window.resourceManager = new Game.ResourceManager();
    window.soundManager = new Game.SoundManager();
    window.settings = new Game.SettingsManager();

    window.garage.init();

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
    $('.btn-pick').click( ui.selectTankAndcloseChoiceWindow.bind( ui ) );
    $('#signin-box-wrapper #change-tank').click( ui.showChoiceWindow.bind( ui ) );

    $('#graphics-quality').click( ui.chageQuality.bind( ui ) );
    $('#sound-on-off').click( ui.changeSound.bind( ui ) );

    $('#viewport-graphics-quality').click( ui.chageQuality.bind( ui ) );
    $('#viewport-sound-on-off').click( ui.changeSound.bind( ui ) );

    $('.share-vk').click( this.gaVk.bind( this ) );
    $('.share-fb').click( this.gaFb.bind( this ) );
    $('.share-tw').click( this.gaTw.bind( this ) );

};

Game.prototype.play = function ( event ) {

    var scope = this;

    if ( event ) {

        event.preventDefault();

    }

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

        network.addMessageListener( 'ArenaJoinResponce', function ( data ) {

            game.joinArena( data );

        });

        network.init( function () {

            // if free prev arena still exists

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

                network.send( 'ArenaJoinRequest', false, { login: login, tank: tank } );

            }, 1000 );

            // UI changes

            ui.setCursor();

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
    this.arena = Game.arena;

    //

    ui.showViewport();
    ui.hideLoaderScreen();

    //

    view.addMap();
    view.addTeamZone();

    // change camera position

    view.camera.position.set( Game.arena.me.position.x + 180, 400, Game.arena.me.position.z );
    view.camera.lookAt( Game.arena.me.position );

    $('#gear_btn').click( ui.openSettings.bind( ui ) );
    $('#exit-btn').click( ui.openSettings.bind( ui ) );
    $('#soundon').click( ui.changeSound.bind( ui ) );
    $('#qualityon').click( ui.chageQuality.bind( ui ) );

    //

    this.prevLoopTime = Date.now();
    this.time = Date.now();

    this.gameLoopInterval = setInterval( this.loop.bind( this ), 20 );

};

Game.prototype.loop = function () {

    var time = Date.now();
    var delta = time - this.prevLoopTime + this.loopTimeRemainder;

    this.loopTimeRemainder = delta % 20;
    delta = delta - this.loopTimeRemainder;
    this.prevLoopTime = time;

    for ( var i = 0, il = Math.floor( delta / 20 ); i < il; i ++ ) {

        this.time += 20;
        this.arena.update( this.time, 20 );

    }

};

Game.prototype.dispose = function ( ) {

    clearInterval( this.gameLoopInterval );

};

//

Game.prototype.gaVk = function () {

    ga('send', {
        hitType: 'event',
        eventCategory: 'game',
        eventAction: 'shareVk'
    });

};

Game.prototype.gaFb = function () {

    ga('send', {
        hitType: 'event',
        eventCategory: 'game',
        eventAction: 'shareFacebook'
    });

};

Game.prototype.gaTw = function () {

    ga('send', {
        hitType: 'event',
        eventCategory: 'game',
        eventAction: 'shareTwiter'
    });

};
