/*
 * @authour ohmed
 * Tree map decoration
*/

var Tree = function ( arena, params ) {

    Game.Decoration.call( this, arena, params );

    this.size.set( 1.5, 1.5, 1.5 );

    this.init();

};

Tree.prototype = Object.create( Game.Decoration.prototype );

Tree.prototype.init = function () {

    var position = this.position;
    var sizeX = this.size.x * this.scale.x;
    var sizeY = this.size.y * this.scale.y;
    var sizeZ = this.size.z * this.scale.z;

    this.arena.pathManager.placeObject( new Game.Vec3( position.x - sizeX / 2, 0, position.z - sizeZ / 2 ), new Game.Vec3( position.x + sizeX / 2, 0, position.z + sizeZ / 2 ) );

};

Tree.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Tree;
