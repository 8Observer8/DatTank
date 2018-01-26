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

Game.Box.Health.prototype.remove = function () {

    view.scene.remove( this.mesh );

};

Game.Box.Health.prototype.update = function ( delta ) {

    this.animTime += delta;
    this.mesh.rotation.y = Math.sin( this.animTime / 600 );
    this.mesh.position.y = Math.sin( this.animTime / 300 ) + 3;

};

Game.Box.Health.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'PickedBox', function ( event ) { scope.remove(); });
    this.addEventListener( 'RemoveBox', function ( event ) { scope.remove(); });

};
