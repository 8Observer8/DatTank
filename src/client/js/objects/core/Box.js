/*
 * @author ohmed
 * Box main class
*/

DT.Box = function ( params ) {

    params = params || {};

    this.id = params.id;

    this.position = new THREE.Vector3();
    this.type = 'none';

    this.mesh = false;

    //

    this.position.set( params.position[0], params.position[1], params.position[2] );
    this.amount = params.amount;

};

DT.Box.prototype = {};
