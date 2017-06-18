/*
 * @authour ohmed
 * OldCastle map decoration
*/

var OldCastle = function ( arena, params ) {

    this.id = OldCastle.numIds ++;

    Game.Decoration.call( this, arena, params );

    this.size.set( 1, 1, 1 );

    this.init();

};

OldCastle.prototype = Object.create( Game.Decoration.prototype );

OldCastle.prototype.init = function () {

    var position = this.position;
    var sizeX = this.size.x * this.scale.x;
    var sizeY = this.size.y * this.scale.y;
    var sizeZ = this.size.z * this.scale.z;
    var id = this.id;

    this.arena.pathManager.placeObject( new Game.Vec3( position.x - sizeX / 2, 0, position.z - sizeZ / 2 ), new Game.Vec3( position.x + sizeX / 2, 0, position.z + sizeZ / 2 ) );
    this.arena.collisionManager.addObject( position, sizeX, sizeY, sizeZ, id );

};

OldCastle.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'oldCastle',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = OldCastle;
