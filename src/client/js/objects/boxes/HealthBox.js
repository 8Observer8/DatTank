/*
 * @author ohmed
 * HealthBox main class
*/

Game.Box.Health = function ( params ) {

    Game.Box.call( this, params );

    this.type = 'HealthBox';
    this.animTime = 600 * Math.random() * Math.PI * 2;

    //

    this.init();

};

Game.Box.Health.prototype = Object.create( Game.Box.prototype );

//

Game.Box.Health.prototype.init = function () {

    var boxModel = resourceManager.getModel( 'health_box.json' );

    this.mesh = new THREE.Mesh( boxModel.geometry, boxModel.material );
    this.mesh.name = 'HealthBox';
    this.mesh.scale.set( 31, 31, 31 );
    this.mesh.rotation.z = Math.PI / 2;
    this.mesh.position.copy( this.position );

    view.scene.add( this.mesh );

    this.addEventListeners();

};

Game.Box.Health.prototype.remove = function ( fromNetwork ) {

    if ( fromNetwork ) {

        Game.arena.boxManager.remove( this );

        var sound = new THREE.PositionalAudio( view.sound.listener );
        sound.position.set( this.position.x, this.position.y, this.position.z );
        sound.setBuffer( resourceManager.getSound('box_pick.wav') );
        sound.loop = false;
        sound.setRefDistance( 200 );
        sound.play();

    } else {

        view.scene.remove( this.mesh );

    }

};

Game.Box.Health.prototype.update = function ( delta ) {

    this.animTime += delta;
    this.mesh.rotation.y = Math.sin( this.animTime / 600 );
    this.mesh.position.y = Math.sin( this.animTime / 300 ) + 3;

};

Game.Box.Health.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'BoxRemove', function () { scope.remove( true ); });

};
