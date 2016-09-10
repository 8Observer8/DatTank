/*
 * @author ohmed
 * AmmoBox main class
*/

DT.Box.Ammo = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'AmmoBox';
    this.amount = 20;

    this.animTime = 600 * Math.random() * Math.PI * 2;

    //

    this.init();

};

DT.Box.Ammo.prototype = Object.create( DT.Box.prototype );

DT.Box.Ammo.prototype.init = function () {

    var boxModel = resourceManager.getModel( 'ammo_box.json' );

    this.mesh = new THREE.Mesh( boxModel.geometry, new THREE.MeshFaceMaterial( boxModel.material ) );
    this.mesh.scale.set( 20, 20, 20 );
    this.mesh.position.copy( this.position );

    view.scene.add( this.mesh );

};

DT.Box.Ammo.prototype.remove = function () {

    view.scene.remove( this.mesh );

};

DT.Box.Ammo.prototype.update = function ( delta ) {

    this.animTime += delta;
    this.mesh.rotation.y = Math.sin( this.animTime / 600 );
    this.mesh.position.y = Math.sin( this.animTime / 300 ) + 20;

};
