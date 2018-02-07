/*
 * @author ohmed
 * AmmoBox main class
*/

Game.Box.Ammo = function ( params ) {

    Game.Box.call( this, params );

    this.type = 'AmmoBox';
    this.animTime = 600 * Math.random() * Math.PI * 2;

    //

    this.init();

};

Game.Box.Ammo.prototype = Object.create( Game.Box.prototype );

//

Game.Box.Ammo.prototype.init = function () {

    var boxModel = resourceManager.getModel( 'ammo_box.json' );

    this.mesh = new THREE.Mesh( boxModel.geometry, boxModel.material );
    this.mesh.name = 'AmmoBox';
    this.mesh.scale.set( 20, 20, 20 );
    this.mesh.position.copy( this.position );

    view.scene.add( this.mesh );

    this.addEventListeners();

};

Game.Box.Ammo.prototype.remove = function ( fromNetwork ) {

    if ( fromNetwork ) {

        Game.arena.boxManager.remove( this );

    } else {

        view.scene.remove( this.mesh );

    }

};

Game.Box.Ammo.prototype.update = function ( delta ) {

    this.animTime += delta;
    this.mesh.rotation.y = Math.sin( this.animTime / 600 );
    this.mesh.position.y = Math.sin( this.animTime / 300 ) + 20;

};

Game.Box.Ammo.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'BoxRemove', function () { scope.remove( true ); });

};
