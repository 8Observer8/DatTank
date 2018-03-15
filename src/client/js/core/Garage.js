/*
 * @author biven, ohmed
 * Tank Garage
*/

Game.Garage = function () {

    this.opened = false;

    this.container = false;
    this.camera = false;
    this.scene = false;
    this.renderer = false;

    this.timer = 0;
    this.lastFrameTime = 0;
    this.rotationSpeed = 0.00015;

    this.loaded = false;

    this.models = {};
    this.currentTank = 0;
    this.currentTankModel = false;

};

Game.Garage.prototype = {};

//

Game.Garage.prototype.init = function () {

    var scope = this;

    $('#arrow1').click( this.prevTank.bind( this ) );
    $('#arrow2').click( this.nextTank.bind( this ) );
    $('.choice-skins .tank').click( this.selectTank.bind( this ) );
    $('.close-tank-skins').click( ui.closeChoiceWindow.bind( ui ) );
    this.container = $('#skin')[0];

    //

    this.loadModels();

    //

    this.camera = new THREE.PerspectiveCamera( 50, $('#skin').innerWidth() / $('#skin').innerHeight(), 1, 2000 );
    this.camera.position.set( 2, 4, 5 );

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0x000000, 0.035 );

    // Lights

    var ambientlight = new THREE.AmbientLight( 0xaaaaaa );
    this.scene.add( ambientlight );

    this.spotLight = new THREE.SpotLight( 0x888888, 1, 30, Math.PI / 4, 0.8 );
    this.spotLight.position.set( 2, 7, 2 );
    this.spotLight.lookAt( this.scene.position );
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 512;
    this.spotLight.shadow.mapSize.height = 512;
    this.spotLight.shadowBias = - 0.001;
    this.scene.add( this.spotLight );

    // Renderer

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( $('#skin').innerWidth() , $('#skin').innerHeight() );
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.container.appendChild( this.renderer.domElement );

    //

    $( document ).keydown( function ( event ) {

        if ( ! scope.opened ) return;

        switch ( event.keyCode ) {

            case 13: // enter key

                ui.selectTankAndcloseChoiceWindow();
                break;

            case 27: // esc key

                ui.closeChoiceWindow();
                break;

            case 39: // right arrow

                scope.nextTank();
                break;

            case 37: // left arrow

                scope.prevTank();
                break;

        }

    });

    //

    window.addEventListener( 'resize', this.resize.bind( this ) );
    this.render = this.render.bind( this );
    this.render();

};

Game.Garage.prototype.loadModels = function () {

    var scope = this;
    var loader = new THREE.JSONLoader();
    var loaded = 0;

    //

    loader.load( 'resources/models/garage-IS2.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.position.y += 0.4;
        model.visible = true;
        model.castShadow = true;
        model.receiveShadow = true;
        model.scale.set( 0.8, 0.8, 0.8 );

        scope.scene.add( model );
        scope.models['IS2'] = model;

        loaded ++;
        if ( loaded === 5 ) {

            scope.loaded = true;
            scope.selectTank();

        }

    });

    loader.load( 'resources/models/garage-T29.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.visible = false;
        model.castShadow = true;
        model.receiveShadow = true;
        model.scale.set( 0.7, 0.7, 0.7 );
        model.position.y += 0.4;

        scope.scene.add( model );
        scope.models['T29'] = model;

        loaded ++;
        if ( loaded === 5 ) {

            scope.loaded = true;
            scope.selectTank();

        }

    });

    loader.load( 'resources/models/garage-T44.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.visible = false;
        model.castShadow = true;
        model.receiveShadow = true;
        model.scale.set( 0.8, 0.8, 0.8 );
        model.position.y += 0.4;

        scope.scene.add( model );
        scope.models['T44'] = model;

        loaded ++;
        if ( loaded === 5 ) {

            scope.loaded = true;
            scope.selectTank();

        }

    });

    loader.load( 'resources/models/garage-T54.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.visible = false;
        model.castShadow = true;
        model.receiveShadow = true;
        model.scale.set( 0.8, 0.8, 0.8 );
        model.position.y += 0.2;

        scope.scene.add( model );
        scope.models['T54'] = model;

        loaded ++;
        if ( loaded === 5 ) {

            scope.loaded = true;
            scope.selectTank();

        }

    });

    loader.load( 'resources/models/garage.json', function ( geometry, materials ) {

        var model = new THREE.Mesh( geometry, materials );
        model.castShadow = true;
        model.receiveShadow = true;
        model.position.y += 0.4;
        scope.scene.add( model );

        loaded ++;
        if ( loaded === 5 ) {

            scope.loaded = true;
            scope.selectTank();

        }

    });

};

Game.Garage.prototype.open = function () {

    if ( this.loaded ) {

        garage.selectTank();

    }

    this.opened = true;
    this.resize();

    this.timer = 0;
    this.camera.position.set( Math.cos( this.timer * this.rotationSpeed ) * 10, 4, Math.sin( this.timer * this.rotationSpeed ) * 10 );
    this.camera.lookAt( this.scene.position );

};

Game.Garage.prototype.close = function () {

    this.opened = false;
    $('.tank-skins').hide();
    soundManager.playMenuSound();

};

Game.Garage.prototype.nextTank = function () {

    if ( $('.choice-skins .tank.active').next().hasClass('tank') ) {

        $('.choice-skins .tank.active').next().click();

    } else {

        $('.choice-skins .tank').first().click();

    }

    localStorage.setItem( 'currentTank', this.currentTank );

};

Game.Garage.prototype.prevTank = function () {

    if ( $('.choice-skins .tank.active').prev().hasClass('tank') ) {

        $('.choice-skins .tank.active').prev().click();

    } else {

        $('.choice-skins .tank').last().click();

    }

    localStorage.setItem( 'currentTank', this.currentTank );

};

Game.Garage.prototype.selectTank = function ( event ) {

    $('.choice-skins .tank.active').removeClass('active');

    var tankId;

    if ( event ) {

        tankId = $( event.currentTarget ).attr('id');
        $( event.currentTarget ).addClass( 'active' );

    } else {

        tankId = localStorage.getItem( 'currentTank' ) || 'T54';
        $( '#' + tankId.replace('-', '') ).addClass( 'active' );

    }

    tankId = ( Game.Tank.list[ tankId ] ) ? tankId : 'T54';
    this.currentTank = tankId;

    $('.skin-name').html( 'Tank: ' + Game.Tank.list[ tankId ].title );
    $('.specification-txt#speed').html( Game.Tank.list[ tankId ].speed + 'km/h' );
    $('.specification-txt#rpm').html( Game.Tank.list[ tankId ].rpm + 'rpm' );
    $('.specification-txt#armour').html( Game.Tank.list[ tankId ].armour + 'mm' );
    $('.specification-txt#bullet').html( Game.Tank.list[ tankId ].bullet + 'mm' );
    $('.specification-txt#ammoCapacity').html( Game.Tank.list[ tankId ].ammoCapacity );

    //

    var maxSpeed = 0;
    var maxRpm = 0;
    var maxArmour = 0;
    var maxBullet = 0;
    var maxAmmoCapacity = 0;

    for ( var tankName in Game.Tank.list ) {

        maxSpeed = Math.max( maxSpeed, Game.Tank.list[ tankName ].speed );
        maxRpm = Math.max( maxRpm, Game.Tank.list[ tankName ].rpm );
        maxArmour = Math.max( maxArmour, Game.Tank.list[ tankName ].armour );
        maxBullet = Math.max( maxBullet, Game.Tank.list[ tankName ].bullet );
        maxAmmoCapacity = Math.max( maxAmmoCapacity, Game.Tank.list[ tankName ].ammoCapacity );

    }

    //

    $('.counter-characteristicks#speed .color').css({ 'width': Math.round( 100 * Game.Tank.list[ tankId ].speed / maxSpeed ) + '%' });
    $('.counter-characteristicks#rpm .color').css({ 'width': Math.round( 100 * Game.Tank.list[ tankId ].rpm / maxRpm ) + '%' });
    $('.counter-characteristicks#armour .color').css({ 'width': Math.round( 100 * Game.Tank.list[ tankId ].armour / maxArmour ) + '%' });
    $('.counter-characteristicks#bullet .color').css({ 'width': Math.round( 100 * Game.Tank.list[ tankId ].bullet / maxBullet ) + '%' });
    $('.counter-characteristicks#ammoCapacity .color').css({ 'width': Math.round( 100 * Game.Tank.list[ tankId ].ammoCapacity / maxAmmoCapacity ) + '%' });

    //

    for ( var modelName in this.models ) {

        this.models[ modelName ].visible = false;

    }

    this.models[ tankId ].visible = true;
    this.currentTankModel = this.models[ tankId ];

    if ( event ) {

        soundManager.playMenuSound();
        localStorage.setItem( 'currentTank', this.currentTank );

    }

};

//

Game.Garage.prototype.resize = function ( event ) {

    var width = Math.floor( $('#skin').innerWidth() );
    var height = Math.floor( $('#skin').innerHeight() );

    this.renderer.setSize( width, height );
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

};

Game.Garage.prototype.render = function () {

    requestAnimationFrame( this.render );

    this.lastFrameTime = this.lastFrameTime || Date.now();
    var delta = Date.now() - this.lastFrameTime;
    this.lastFrameTime = Date.now();
    this.timer += delta;

    //

    if ( this.currentTankModel ) {
    
        this.currentTankModel.rotation.y = this.timer * this.rotationSpeed;

    }

    this.renderer.render( this.scene, this.camera );

};
