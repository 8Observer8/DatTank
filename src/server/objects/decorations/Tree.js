/*
 * @authour ohmed
 * Tree map decoration
*/

var Tree = function ( arena, params ) {

    this.id = Tree.numIds ++;

    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );

    this.init();

};

Tree.prototype = Object.create( Game.Decoration.prototype );

Tree.prototype.init = function () {

    var position = this.position;
    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 3;

    this.arena.pathManager.placeObject( new Game.Vec3( position.x - this.sizeX / 2, 0, position.z - this.sizeZ / 2 ), new Game.Vec3( position.x + this.sizeX / 2, 0, position.z + this.sizeZ / 2 ) );
    this.arena.collisionManager.addObject( this, 'circle' );

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
