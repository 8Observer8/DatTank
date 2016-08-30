/*
 * @author biven, ohmed
 * Tank Garage
*/

DT.Garage = function () {

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

};

DT.Garage.prototype = {};

DT.Garage.prototype.init = function () {

    soundSys.playMenuSound();

    $('#arrow1').click( garage.arrowBack.bind( this ) );
    $('#arrow2').click( garage.arrowForward.bind( this ) );
    $('.choice-skins .tank').click( this.selectTank.bind( this ) );

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

    });

    var loader2 = new THREE.JSONLoader();

    loader2.load( 'resources/models/tank-demo-2.json', function ( geometry, materials ) {

        var material = new THREE.MultiMaterial( materials );
        model = new THREE.Mesh( geometry, material );
        model.position.y += 0.3;
        model.visible = false;

        scope.scene.add( model );
        scope.models['UKBlackPrince'] = model;

    });

    var loaderscene = new THREE.AssimpJSONLoader();

    loaderscene.load( 'resources/models/assimp/interior/interior.assimp.json', function ( object ) {

        scope.scene.add( object );
        $('.choice-skins .tank').first().click();

    }, scope.onProgress );

    this.animate();

};

DT.Garage.prototype.onProgress = function ( xhr ) {

    if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

    }

};

DT.Garage.prototype.onWindowResize = function ( event ) {

    this.renderer.setSize( $('#skin').innerWidth() , $('#skin').innerHeight() );

    this.camera.aspect = $('#skin').innerWidth() / $('#skin').innerHeight();
    this.camera.updateProjectionMatrix();

};

DT.Garage.prototype.animate = function () {

    requestAnimationFrame( this.animate );
    this.render();

};

DT.Garage.prototype.render = function () {

    this.onWindowResize();

    var timer = Date.now() * 0.00015;

    this.camera.position.set( Math.cos( timer ) * 10, 4, Math.sin( timer ) * 10 );
    this.camera.lookAt( this.scene.position );

    this.renderer.render( this.scene, this.camera );

};

// stop rendering

DT.Garage.prototype.stop = function () {

    this.renderer.domElement.remove();
    soundSys.playMenuSound();

};

DT.Garage.prototype.arrowForward = function () {

    if ( $('.choice-skins .tank.active').next().length ) {
    
        $('.choice-skins .tank.active').next().click();

    } else {

        $('.choice-skins .tank').first().click();

    }

};

DT.Garage.prototype.arrowBack = function () {

    if ( $('.choice-skins .tank.active').prev().length ) {
    
        $('.choice-skins .tank.active').prev().click();

    } else {

        $('.choice-skins .tank').last().click();

    }

};

DT.Garage.prototype.selectTank = function ( event ) {

    $('.choice-skins .tank.active').removeClass('active');
    $( event.currentTarget ).addClass( 'active' );

    var tankId = $( event.currentTarget ).attr('id');

    $('.name-specifications').html( DT.Tank.list[ tankId ].title );
    $('.specification-text#speed').html( '&#x2623;&nbsp;&nbsp;&nbsp;' + 'Speed: ' + DT.Tank.list[ tankId ].speed + 'km/h' );
    $('.specification-text#range').html( '&#x2623;&nbsp;&nbsp;&nbsp;' + 'Range: ' + DT.Tank.list[ tankId ].range + 'km' );
    $('.specification-text#armour').html( '&#x2623;&nbsp;&nbsp;&nbsp;' + 'Armour: ' + DT.Tank.list[ tankId ].armour + 'mm' );
    $('.specification-text#bullet').html( '&#x2623;&nbsp;&nbsp;&nbsp;' + 'Bullet: ' + DT.Tank.list[ tankId ].bullet + 'mm' );
    this.currentTank = tankId;

    for ( var modelName in this.models ) {

        this.models[ modelName ].visible = false;

    }

    this.models[ tankId ].visible = true;

    soundSys.playMenuSound();

};

DT.Garage.prototype.pickTank = function () {

    localStorage.setItem( 'selectedTank', this.currentTank );

};
