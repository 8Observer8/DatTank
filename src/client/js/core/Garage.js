/*
 * @author biven, ohmed
 * Tank Garage
*/

Game.Garage = function () {

    this.container = false;
    this.camera = false;
    this.scene = false;
    this.renderer = false;
    this.objects = false;

    this.models = {};

    this.object = false;
    this.Tank_01 = false;
    this.Tank_02 = false;

    this.currentTank = 0;

    this.clock = new THREE.Clock();

    //

    this.init();

};

Game.Garage.prototype = {};

Game.Garage.prototype.init = function () {

    $('#arrow1').click( this.arrowBack.bind( this ) );
    $('#arrow2').click( this.arrowForward.bind( this ) );
    $('.choice-skins .tank').click( this.selectTank.bind( this ) );
    $('.close-tank-skins').click( ui.closeChoiceWindow.bind( ui ) );

    //

    this.animate = this.animate.bind( this );
    this.container = document.getElementById( 'skin' );

    this.camera = new THREE.PerspectiveCamera( 50, $('#skin').innerWidth() / $('#skin').innerHeight(), 1, 2000 );
    this.camera.position.set( 2, 4, 5 );

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0x000000, 0.035 );

    // Lights

    var ambientlight = new THREE.AmbientLight( 0xeeeeee );
    this.scene.add( ambientlight );

    // Renderer

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( $('#skin').innerWidth() , $('#skin').innerHeight() );

    this.container.appendChild( this.renderer.domElement );

    var scope = this;

    //

    var loader1 = new THREE.JSONLoader();
    var loaded = 0;

    loader1.load( 'resources/models/tank-demo-1.json', function ( geometry, materials ) {

        var material = new THREE.MultiMaterial( materials );
        var model = new THREE.Mesh( geometry, material );
        model.position.y += 0.3;
        model.position.x += 1;
        model.position.z -= 1.5;
        model.rotation.y = - Math.PI / 2;
        model.visible = true;

        scope.scene.add( model );
        scope.models['USAT54'] = model;

        loaded ++;

    });

    var loader2 = new THREE.JSONLoader();

    loader2.load( 'resources/models/tank-demo-2.json', function ( geometry, materials ) {

        var material = new THREE.MultiMaterial( materials );
        model = new THREE.Mesh( geometry, material );
        model.position.y += 0.3;
        model.visible = false;

        scope.scene.add( model );
        scope.models['UKBlackPrince'] = model;

        loaded ++;

    });

    var loaderscene = new THREE.AssimpJSONLoader();

    loaderscene.load( 'resources/models/assimp/interior/interior.assimp.json', function ( object ) {

        scope.scene.add( object );

        loaded ++;

    }, scope.onProgress );

    $( document ).keydown( function ( event ) {

        if ( event.keyCode === 27 ) {

            ui.closeChoiceWindow();

        }

    });

    this.animate();

};

Game.Garage.prototype.onProgress = function ( xhr ) {

    if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;

    }

};

Game.Garage.prototype.onWindowResize = function ( event ) {

    this.renderer.setSize( $('#skin').innerWidth(), $('#skin').innerHeight() );

    this.camera.aspect = $('#skin').innerWidth() / $('#skin').innerHeight();
    this.camera.updateProjectionMatrix();

};

Game.Garage.prototype.animate = function () {

    requestAnimationFrame( this.animate );
    this.render();

};

Game.Garage.prototype.render = function () {

    this.onWindowResize();

    var timer = Date.now() * 0.00015;

    this.camera.position.set( Math.cos( timer ) * 10, 4, Math.sin( timer ) * 10 );
    this.camera.lookAt( this.scene.position );

    this.renderer.render( this.scene, this.camera );

};

Game.Garage.prototype.stop = function () {

    soundManager.playMenuSound();

};

Game.Garage.prototype.arrowForward = function () {

    if ( $('.choice-skins .tank.active').next().length ) {

        $('.choice-skins .tank.active').next().click();

    } else {

        $('.choice-skins .tank').first().click();

    }

};

Game.Garage.prototype.arrowBack = function () {

    if ( $('.choice-skins .tank.active').prev().length ) {

        $('.choice-skins .tank.active').prev().click();

    } else {

        $('.choice-skins .tank').last().click();

    }

};

Game.Garage.prototype.selectTank = function ( event ) {

    $('.choice-skins .tank.active').removeClass('active');
    var tankId;

    if ( event ) {

        var tankId = $( event.currentTarget ).attr('id');
        $( event.currentTarget ).addClass( 'active' );

    } else {

        tankId = localStorage.getItem( 'currentTank' ) || 'USA-T54';

    }

    $('.name-specifications').html( Game.Tank.list[ tankId ].title );
    $('.specification-text#speed').html( '&#x2623;&nbsp;&nbsp;&nbsp;' + 'Speed: ' + Game.Tank.list[ tankId ].speed + 'km/h' );
    $('.specification-text#range').html( '&#x2623;&nbsp;&nbsp;&nbsp;' + 'Range: ' + Game.Tank.list[ tankId ].range + 'km' );
    $('.specification-text#armour').html( '&#x2623;&nbsp;&nbsp;&nbsp;' + 'Armour: ' + Game.Tank.list[ tankId ].armour + 'mm' );
    $('.specification-text#bullet').html( '&#x2623;&nbsp;&nbsp;&nbsp;' + 'Bullet: ' + Game.Tank.list[ tankId ].bullet + 'mm' );
    this.currentTank = tankId;

    for ( var modelName in this.models ) {

        this.models[ modelName ].visible = false;

    }

    this.models[ tankId ].visible = true;

    if ( event ) {

        soundManager.playMenuSound();

    }

};

Game.Garage.prototype.pickTank = function () {

    localStorage.setItem( 'currentTank', this.currentTank );

};
