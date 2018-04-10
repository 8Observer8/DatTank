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

    this.logger = new Game.Logger();

};

Game.Version = 'v0.5.0';

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
    window.soundManager = new Game.SoundManager();
    window.view = new Game.ViewManager();
    window.controls = new Game.ControlsManager();
    window.resourceManager = new Game.ResourceManager();
    window.settings = new Game.SettingsManager();

    window.garage.init();

    //

    ui.init();

    var login = $('#username').val() || localStorage.getItem('login') || '';
    $('#username').val( login );

    // add handlers

    $('#signin-box #username').focus();
    $('#signin-box #username').keydown( function ( event ) {

        if ( $('#play-btn #play-btn-text').html() !== 'PLAY!' ) return;

        if ( event.keyCode === 13 && ! garage.opened ) {

            event.stopPropagation();
            document.activeElement.blur();
            ui.showChoiceWindow();

        }

    });

    $('#play-btn').click( ui.showChoiceWindow.bind( ui ) );
    $('.change-skin-btn').click( ui.showChoiceWindow.bind( ui ) );
    $('.btn-pick').click( ui.selectTankAndcloseChoiceWindow.bind( ui ) );
    $('#signin-box-wrapper #change-tank').click( ui.showChoiceWindow.bind( ui ) );

    $('#fullscreen-on-off').click( ui.changeFullScreen.bind( ui ) );
    $('#graphics-quality').click( ui.changeQuality.bind( ui ) );
    $('#sound-on-off').click( ui.changeSound.bind( ui ) );

    $('#viewport-fullscreen-on-off').click( ui.changeFullScreen.bind( ui ) );
    $('#viewport-graphics-quality').click( ui.changeQuality.bind( ui ) );
    $('#viewport-sound-on-off').click( ui.changeSound.bind( ui ) );

    $('.share-vk').click( this.gaVk.bind( this ) );
    $('.share-fb').click( this.gaFb.bind( this ) );
    $('.share-tw').click( this.gaTw.bind( this ) );

};

Game.prototype.play = function ( event ) {

    ui.showLoaderScreen();
    ui.hideSignInPopup();
    ui.hideFooter();

    resourceManager.load( function ( progress ) {

        var value = Math.round( 100 * progress ) + '%';
        $('#loader-wrapper #progress-wrapper #progress-bar').css( 'width', value );
        $('#loader-wrapper #loader-wrapper-title span').html( value );

    }, function () {

        $('#loader-wrapper #progress-wrapper').hide();
        $('#loader-wrapper #loader-wrapper-title').html('Initializing arena...');

        // init controls

        controls.keyInit();

        // init network

        network.addMessageListener( 'ArenaJoinResponse', function ( data ) {

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

            var tank = localStorage.getItem( 'currentTank' ) || 0;

            setTimeout( function () {

                game.logger.newEvent( 'play' );
                network.send( 'ArenaJoinRequest', false, { login: login, tank: tank } );

            }, 1000 );

            // UI changes

            ui.setCursor();

        });

    });

};

Game.prototype.joinArena = function ( params ) {

    Game.arena = new Game.Arena();

    //

    ui.showViewport();
    ui.hideLoaderScreen();

    //

    Game.arena.init( params );
    this.arena = Game.arena;

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

        this.time += delta;
        this.arena.update( this.time, 20 );

    }

};

Game.prototype.dispose = function ( ) {

    this.arena.stopped = true;
    clearInterval( this.gameLoopInterval );

};

//

Game.prototype.gaVk = function () {

    game.logger.newEvent( 'shareVk', 'game' );

};

Game.prototype.gaFb = function () {

    game.logger.newEvent( 'shareFacebook', 'game' );

};

Game.prototype.gaTw = function () {

    game.logger.newEvent( 'shareTwiter', 'game' );

};
