/*
 * @author ohmed
 * AmmoBox main class
*/

DT.Box.Ammo = function ( params ) {

    DT.Box.call( this, params );

    this.type = 'AmmoBox';
    this.amount = 20;

    //

    this.init();

};

DT.Box.Ammo.prototype = Object.create( DT.Box.prototype );

DT.Box.Ammo.prototype.init = function () {

    var geometry = new THREE.BoxGeometry( 10, 10, 10 );
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.position.copy( this.position );

    view.scene.add( this.mesh );

};

DT.Box.Ammo.prototype.remove = function () {

    view.scene.remove( this.mesh );

};
