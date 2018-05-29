/*
 * @author ohmed
 * Box main class
*/

var Box = function ( arena, params ) {

    params = params || {};

    if ( Box.numId > 1000 ) Box.numIds = 0;
    this.id = Box.numId ++;
    this.arena = arena;

    this.position = new Game.Vec3( params.position.x, params.position.y, params.position.z ) || new Game.Vec3( 0, 20, 0 );
    this.radius = 10;

    this.amount = 0;
    this.removed = false;
    this.type = 'Box';

    this.networkBuffers = {};

};

Box.prototype = {};

//

Box.prototype.init = function () {

    this.arena.collisionManager.addObject( this, 'circle' );

};

Box.prototype.dispose = function () {

    this.networkBuffers['RemoveBox'] = this.networkBuffers['RemoveBox'] || {};
    var buffer = this.networkBuffers['RemoveBox'].buffer || new ArrayBuffer( 4 );
    var bufferView = this.networkBuffers['RemoveBox'].bufferView || new Uint16Array( buffer );
    this.networkBuffers['RemoveBox'].buffer = buffer;
    this.networkBuffers['RemoveBox'].bufferView = bufferView;

    bufferView[1] = this.id;

    //

    this.arena.sendEventToPlayersInRange( this.position, 'BoxRemove', buffer, bufferView );

};

Box.prototype.toJSON = function () {

    return {

        id:         this.id,
        type:       this.boxType,
        amount:     this.amount,
        position:   this.position.toJSON()

    };

};

Box.numId = 0;

//

module.exports = Box;
