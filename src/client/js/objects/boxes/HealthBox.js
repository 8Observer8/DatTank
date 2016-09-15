/*
 * @author ohmed
 * HealthBox main class
*/

DT.Box.Health = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'HealthBox';
    this.amount = 20;

    this.animTime = 600 * Math.random() * Math.PI * 2;

    //

    this.init();

};

DT.Box.Health.prototype = Object.create( DT.Box.prototype );

DT.Box.Health.prototype.init = function () {

    var boxModel = resourceManager.getModel( 'health_box.json' );

    this.mesh = new THREE.Mesh( boxModel.geometry, new THREE.MeshFaceMaterial( boxModel.material ) );
    this.mesh.name = 'HealthBox';
    this.mesh.scale.set( 31, 31, 31 );
    this.mesh.rotation.z = Math.PI / 2;

    this.mesh.position.copy( this.position );

    view.scene.add( this.mesh );

};

DT.Box.Health.prototype.remove = function () {

    view.scene.remove( this.mesh );

};

DT.Box.Health.prototype.update = function ( delta ) {

    this.animTime += delta;
    this.mesh.rotation.y = Math.sin( this.animTime / 600 );
    this.mesh.position.y = Math.sin( this.animTime / 300 ) + 3;

};
