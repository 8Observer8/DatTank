/*
 * @author ohmed
 * Tree8 map decoration
*/

var Tree8 = function ( arena, params ) {

    this.arena = arena;
    this.id = Tree8.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.radius = 0.5;
    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree8';

    this.init();

};

Tree8.prototype = Object.create( Game.Decoration.prototype );

Tree8.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 12;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 12, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.rotation = Math.random() * Math.PI * 2;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree8.prototype.toJSON = function () {

    return {
        id:         this.id,
        type:       'Tree8',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Tree8.canPlace = function ( arena, x, z ) {

    return arena.collisionManager.isPlaceFree( { x: x, y: z }, 40, 0 );

};

//

module.exports = Tree8;
