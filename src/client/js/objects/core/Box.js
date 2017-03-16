/*
 * @author ohmed
 * Box main class
*/

Game.Box = function ( params ) {

    params = params || {};

    EventDispatcher.call( this );

    this.id = params.id;

    this.position = new THREE.Vector3( params.position.x || 0, params.position.y || 0, params.position.z || 0 );
    this.type = 'none';

    this.mesh = false;

    //

    this.amount = params.amount;

};

Game.Box.prototype = Object.create( EventDispatcher.prototype );
