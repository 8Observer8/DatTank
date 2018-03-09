/*
 * @author biven, ohmed
 * Tank Garage
*/

Game.Garage = function () {

    this.container = false;
    this.camera = false;
    this.scene = false;
    this.renderer = false;

    this.models = {};
    this.currentTank = 0;

    this.maxSpeed = 5;
    this.maxRange = 21;
    this.maxArmour = 70;
    this.maxBullet = 12;

};

Game.Garage.prototype = {};

//

Game.Garage.prototype.init = function () {

    var scope = this;

    $('#arrow1').click( this.arrowBack.bind( this ) );
    $('#arrow2').click( this.arrowForward.bind( this ) );
    $('.choice-skins .tank').click( this.selectTank.bind( this ) );
    $('.close-tank-skins').click( ui.closeChoiceWindow.bind( ui ) );
    $('.unblockTank').click( this.unblockTank.bind( this ) );

    //

    this.container = document.getElementById( 'skin' );

    this.camera = new THREE.PerspectiveCamera( 50, $('#skin').innerWidth() / $('#skin').innerHeight(), 1, 2000 );
    this.camera.position.set( 2, 4, 5 );

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0x000000, 0.035 );

    // Lights

    var ambientlight = new THREE.AmbientLight( 0xeeeeee );
    this.scene.add( ambientlight );

    this.spotLight = new THREE.SpotLight( 0xaaaaaa, 0.5, 10, Math.PI / 4, 0.4 );
    this.spotLight.position.set( 2, 5, 2 );
    this.spotLight.lookAt( this.scene.position );
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.scene.add( this.spotLight );

    // Renderer

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( $('#skin').innerWidth() , $('#skin').innerHeight() );
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.container.appendChild( this.renderer.domElement );

    //

    var loader = new THREE.JSONLoader();
    var loaded = 0;

    loader.load( 'resources/models/tank-demo-1.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.position.y += 0.6;
        // model.position.x += 1;
        // model.position.z -= 1.5;
        model.rotation.y = - Math.PI / 2;
        model.visible = true;
        model.castShadow = true;
        model.receiveShadow = true;

        scope.scene.add( model );
        scope.models['USAT54'] = model;

        loaded ++;

    });

    loader.load( 'resources/models/tank-demo-2.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.position.y += 0.6;
        model.visible = false;
        model.castShadow = true;
        model.receiveShadow = true;

        scope.scene.add( model );
        scope.models['UKBlackPrince'] = model;

        loaded ++;

    });

    loader.load( 'resources/models/tank-demo-3.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.rotation.y = - Math.PI / 2;
        model.position.y += 0.3;
        model.visible = false;
        model.castShadow = true;
        model.receiveShadow = true;

        scope.scene.add( model );
        scope.models['D32'] = model;

        loaded ++;

    });

    loader.load( 'resources/models/tank-demo-4.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.rotation.y = - Math.PI / 2;
        model.position.y += 0.3;
        model.visible = false;
        model.castShadow = true;
        model.receiveShadow = true;

        scope.scene.add( model );
        scope.models['D32'] = model;

        loaded ++;

    });

    loader.load( 'resources/models/garage.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.castShadow = true;
        model.receiveShadow = true;
        model.position.y += 0.4;
        scope.scene.add( model );

        loaded ++;

    });

    //

    $( document ).keydown( function ( event ) {

        if ( event.keyCode === 27 ) {

            ui.closeChoiceWindow();

        }

    });

    //

    window.addEventListener( 'resize', this.resize.bind( this ) );
    this.render = this.render.bind( this );
    this.render();

};

Game.Garage.prototype.resize = function ( event ) {

    this.renderer.setSize( $('#skin').innerWidth(), $('#skin').innerHeight() );
    this.camera.aspect = $('#skin').innerWidth() / $('#skin').innerHeight();
    this.camera.updateProjectionMatrix();

};

Game.Garage.prototype.render = function () {

    requestAnimationFrame( this.render );
    var timer = Date.now() * 0.00015;

    //

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

    localStorage.setItem( 'currentTank', this.currentTank );

};

Game.Garage.prototype.arrowBack = function () {

    if ( $('.choice-skins .tank.active').prev().length ) {

        $('.choice-skins .tank.active').prev().click();

    } else {

        $('.choice-skins .tank').last().click();

    }

    localStorage.setItem( 'currentTank', this.currentTank );

};

Game.Garage.prototype.selectTank = function ( event ) {

    this.resize();
    $('.choice-skins .tank.active').removeClass('active');

    var tankId;

    if ( event ) {

        tankId = $( event.currentTarget ).attr('id');
        $( event.currentTarget ).addClass( 'active' );

    } else {

        tankId = localStorage.getItem( 'currentTank' ) || 'USAT54';
        $( '#' + tankId.replace('-', '') ).addClass( 'active' );

    }

    tankId = ( Game.Tank.list[ tankId ] ) ? tankId : 'USAT54';
    this.currentTank = tankId;

    $('.skin-name').html( Game.Tank.list[ tankId ].title );
    $('.specification-txt#speed').html( Game.Tank.list[ tankId ].speed + 'km/h');
    $('.specification-txt#range').html( Game.Tank.list[ tankId ].range + 'km');
    $('.specification-txt#armour').html( Game.Tank.list[ tankId ].armour + 'mm');
    $('.specification-txt#bullet').html( Game.Tank.list[ tankId ].bullet + 'mm');

    $('.counter-characteristicks#speed .color').css({ 'width': Math.round( 10 * Game.Tank.list[ tankId ].speed / this.maxSpeed ) +'%' });
    $('.counter-characteristicks#range .color').css({ 'width': Math.round( 10 * Game.Tank.list[ tankId ].range / this.maxRange ) +'%' });
    $('.counter-characteristicks#armour .color').css({ 'width': Math.round( 10 * Game.Tank.list[ tankId ].armour / this.maxArmour ) +'%' });
    $('.counter-characteristicks#bullet .color').css({ 'width': Math.round( 10 * Game.Tank.list[ tankId ].bullet / this.maxBullet ) +'%' });

    //

    for ( var modelName in this.models ) {

        this.models[ modelName ].visible = false;

    }

    this.models[ tankId ].visible = true;

    if ( event ) {

        soundManager.playMenuSound();
        localStorage.setItem( 'currentTank', this.currentTank );

        if ( localStorage.getItem( 'currentTank' ) !== 'D32' ) {

            $('.share-label').hide();

        }

    }

};

Game.Garage.prototype.pickTank = function () {

    if ( localStorage.getItem( 'currentTank' ) === 'D32' && localStorage.getItem( 'unblockedTank' ) !== 'true' ) {

        $('.share-label').show();

    }

};

Game.Garage.prototype.unblockTank = function () {

    localStorage.setItem( 'unblockedTank', true );

};
