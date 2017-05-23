
/*
 * @authour ohmed
 * Stones map decoration
*/

var Stones2 = function ( arena, params ) {

    Game.Decoration.call( this, arena, params );

    this.size.set( 0, 0, 0 );

    this.init();

};

Stones2.prototype = Object.create( Game.Decoration.prototype );

Stones2.prototype.init = function () {

    var position = this.position;
    var sizeX = this.size.x * this.scale.x;
    var sizeY = this.size.y * this.scale.y;
    var sizeZ = this.size.z * this.scale.z;

    this.arena.pathManager.placeObject( new Game.Vec3( position.x - sizeX / 2, 0, position.z - sizeZ / 2 ), new Game.Vec3( position.x + sizeX / 2, 0, position.z + sizeZ / 2 ) );
    // this.arena.collisionManager.addObject( position, sizeX, sizeY, sizeZ );

};

Stones2.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'rock2',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Stones2;
