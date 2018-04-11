/*
 * @author ohmed
 * AmmoBox main class
*/

Game.Box.Ammo.prototype.init = function () {

    var boxModel = resourceManager.getModel( 'ammo_box.json' );

    this.mesh = new THREE.Mesh( boxModel.geometry, boxModel.material );
    this.mesh.name = 'AmmoBox';
    this.mesh.scale.set( 20, 20, 20 );
    this.mesh.position.copy( this.position );

    view.scene.add( this.mesh );

};

Game.Box.Ammo.prototype.remove = function ( fromNetwork ) {

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
