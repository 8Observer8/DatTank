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

Game.Box.Ammo.prototype.init = function () {

    var boxModel = resourceManager.getModel( 'ammo_box.json' );

    this.mesh = new THREE.Mesh( boxModel.geometry, new THREE.MeshFaceMaterial( boxModel.material ) );
    this.mesh.name = 'AmmoBox';
    this.mesh.scale.set( 20, 20, 20 );
    this.mesh.position.copy( this.position );

    view.scene.add( this.mesh );

};

Game.Box.Ammo.prototype.remove = function () {

    view.scene.remove( this.mesh );

};

Game.Box.Ammo.prototype.update = function ( delta ) {

    this.animTime += delta;
    this.mesh.rotation.y = Math.sin( this.animTime / 600 );
    this.mesh.position.y = Math.sin( this.animTime / 300 ) + 20;

};
