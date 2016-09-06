/*
 * @author ohmed
 * HealthBox main class
*/

DT.Box.Health = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'HealthBox';
    this.amount = 20;

    //

    this.init();

};

DT.Box.Health.prototype = Object.create( DT.Box.prototype );

DT.Box.Health.prototype.init = function () {

    var geometry = new THREE.BoxGeometry( 10, 10, 10 );
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.position.copy( this.position );

    view.scene.add( this.mesh );

};

DT.Box.Health.prototype.remove = function () {

    view.scene.remove( this.mesh );

};
