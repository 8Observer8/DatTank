var container, stats;
var camera, scene, renderer, objects;
var object1, object2;

var clock = new THREE.Clock();

// init scene
init();

var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
	}
};

function onWindowResize( event ) {

	renderer.setSize( $("#skin").innerWidth() , $("#skin").innerHeight() );

	camera.aspect = $("#skin").innerWidth() / $("#skin").innerHeight();
	camera.updateProjectionMatrix();

};

var onError = function ( xhr ) {
};

// Load jeep model using the AssimpJSONLoader

var loader1 = new THREE.JSONLoader();
loader1.load( "resources/models/tank.json" , function( geometry, materials ) {
	var material = new THREE.MultiMaterial( materials );
	object1 = new THREE.Mesh( geometry, material );
	scene.add( object1 );
	object1.position.y += 0.3;
	object1.visible = true;
	localStorage.setItem( 'model1', true );

});

var loader2 = new THREE.JSONLoader();
loader2.load( "resources/models/Tank01_top.json" , function( geometry, materials ) {
	var material = new THREE.MultiMaterial( materials );
	object2 = new THREE.Mesh( geometry, material );
	scene.add( object2 );
	object2.position.y +=0.3;
	object2.visible = false;
	localStorage.setItem( 'model2', false );

});

// load interior model
var loaderscene = new THREE.AssimpJSONLoader();
loaderscene.load( 'resources/models/assimp/interior/interior.assimp.json', function ( object ) {

	scene.add( object );

}, onProgress, onError );

animate();

//

function init() {

	container = document.getElementById( 'skin' );

	camera = new THREE.PerspectiveCamera( 50, $("#skin").innerWidth() / $("#skin").innerHeight(), 1, 2000 );
	camera.position.set( 2, 4, 5 );

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.035 );

	// Lights
	var ambientlight = new THREE.AmbientLight(0xeeeeee);
	scene.add( ambientlight );
	// scene.add( new THREE.AmbientLight( 0xcccccc ) );

	// var directionalLight = new THREE.DirectionalLight( 0xeeeeee );
	// directionalLight.position.x = Math.random() - 0.5;
	// directionalLight.position.y = Math.random();
	// directionalLight.position.z = Math.random() - 0.5;
	// directionalLight.position.normalize();
	// scene.add( directionalLight );

	// Renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( $("#skin").innerWidth() , $("#skin").innerHeight() );

	container.appendChild( renderer.domElement );
	
	// Events
	window.addEventListener( 'resize', onWindowResize, false );

};
// 

function animate() {

	requestAnimationFrame( animate );
				
	render();
};

//

function render() {

	onWindowResize();

	var timer = Date.now() * 0.00015;

	camera.position.x = Math.cos( timer ) * 10;
	camera.position.y = 4;
	camera.position.z = Math.sin( timer ) * 10;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

};
