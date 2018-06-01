/*
 * @author ohmed
 * Tree2 map decoration
*/

var Tree2 = function ( arena, params ) {

    this.arena = arena;
    this.id = Tree2.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.radius = 4;
    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree2';

    this.init();

};

Tree2.prototype = Object.create( Game.Decoration.prototype );

Tree2.prototype.init = function () {

    var sizeXZ = 15 * Math.random() + 30;
    this.scale = new Game.Vec3( sizeXZ, 15 * Math.random() + 30, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.rotation = Math.random() * Math.PI * 2;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree2.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'Tree2',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Tree2.canPlace = function ( arena, x, z ) {

    return arena.collisionManager.isPlaceFree( { x: x, y: z }, 40, 0 );

};

//

module.exports = Tree2;