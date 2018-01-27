/*
 * @authour ohmed
 * OldCastle map decoration
*/

var OldCastle = function ( arena, params ) {

    this.id = OldCastle.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 2, 2, 2 );
    this.type = 'OldCastle';
    this.init();

};

OldCastle.prototype = Object.create( Game.Decoration.prototype );

OldCastle.prototype.init = function () {

    var position = this.position;
    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    var id = this.id;

    this.arena.pathManager.placeObject( new Game.Vec3( position.x - this.sizeX / 2, 0, position.z - this.sizeZ / 2 ), new Game.Vec3( position.x + this.sizeX / 2, 0, position.z + this.sizeZ / 2 ) );
    this.arena.collisionManager.addObject( this, 'box' );

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
