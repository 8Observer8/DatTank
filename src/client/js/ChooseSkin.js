/*
 * @author biven, ohmed
 * Tank customization
*/

DT.ChooseSkin = function () {

    this.container = false;
    this.camera = false;
    this.scene = false;
    this.renderer = false;
    this.objects = false;

    this.object = false;
    this.Tank_01 = false;
    this.Tank_02 = false;

    this.clock = new THREE.Clock();

};

DT.ChooseSkin.prototype = {};

DT.ChooseSkin.prototype.init = function () {

    soundSys.playMenuSound();

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

    loader1.load( 'resources/models/tank.json', function ( geometry, materials ) {

        var material = new THREE.MultiMaterial( materials );
        Tank_01 = new THREE.Mesh( geometry, material );
        scope.scene.add( Tank_01 );
        Tank_01.position.y += 0.3;
        Tank_01.visible = true;
        localStorage.setItem( 'model1', true );

    });

    var loader2 = new THREE.JSONLoader();

    loader2.load( 'resources/models/Tank01_top.json', function ( geometry, materials ) {

        var material = new THREE.MultiMaterial( materials );
        Tank_02 = new THREE.Mesh( geometry, material );
        scope.scene.add( Tank_02 );
        Tank_02.position.y += 0.3;
        Tank_02.visible = false;
        localStorage.setItem( 'model2', false );

    });

    var loaderscene = new THREE.AssimpJSONLoader();

    loaderscene.load( 'resources/models/assimp/interior/interior.assimp.json', function ( object ) {

        scope.scene.add( object );

    }, scope.onProgress );

    this.animate();

};

DT.ChooseSkin.prototype.onProgress = function ( xhr ) {

    if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

    }

};

DT.ChooseSkin.prototype.onWindowResize = function ( event ) {

    this.renderer.setSize( $('#skin').innerWidth() , $('#skin').innerHeight() );

    this.camera.aspect = $('#skin').innerWidth() / $('#skin').innerHeight();
    this.camera.updateProjectionMatrix();

};

DT.ChooseSkin.prototype.animate = function () {

    requestAnimationFrame( this.animate );
    this.render();

};

DT.ChooseSkin.prototype.render = function () {

    this.onWindowResize();

    var timer = Date.now() * 0.00015;

    this.camera.position.set( Math.cos( timer ) * 10, 4, Math.sin( timer ) * 10 );
    this.camera.lookAt( this.scene.position );

    this.renderer.render( this.scene, this.camera );

};

// stop rendering

DT.ChooseSkin.prototype.stop = function () {

    this.renderer.domElement.remove();
    soundSys.playMenuSound();

};

DT.ChooseSkin.prototype.chooseModel1 = function () {

    var value = ( typeof value === 'boolean' ) ? value : $('#model1').attr('model1') !== 'true';

    localStorage.setItem( 'model1', value );
    localStorage.setItem( 'model2', false );

    if ( localStorage.getItem('model1') === 'true' ) {

        Tank_02.visible = false;
        Tank_01.visible = true;

    }

    soundSys.playMenuSound();

};

DT.ChooseSkin.prototype.chooseModel2 = function () {

    var value = ( typeof value === 'boolean' ) ? value : $('#model2').attr('model2') !== 'true';

    localStorage.setItem( 'model2', value );
    localStorage.setItem( 'model1', false );

    if ( localStorage.getItem('model2') === 'true' ) {

        Tank_02.visible = true;
        Tank_01.visible = false;

    }

    soundSys.playMenuSound();

};

DT.ChooseSkin.prototype.arrowForward = function () {

    if ( Tank_01.visible === true ) {

        chooseSkin.chooseModel2();
        soundSys.playMenuSound();

    } else {

        chooseSkin.chooseModel1();
        soundSys.playMenuSound();

    }

};

DT.ChooseSkin.prototype.arrowBack = function () {

    if ( Tank_02.visible === true ) {

        chooseSkin.chooseModel1();
        soundSys.playMenuSound();

    } else {

        chooseSkin.chooseModel2();
        soundSys.playMenuSound();

    }

};
