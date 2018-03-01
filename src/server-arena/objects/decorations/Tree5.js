/*
 * @author ohmed
 * Tree5 map decoration
*/

var Tree5 = function ( arena, params ) {

    this.arena = arena;
    this.id = Tree5.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.radius = 15;
    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree5';

    this.init();

};

Tree5.prototype = Object.create( Game.Decoration.prototype );

Tree5.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 12;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 12, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.rotation = Math.random() * Math.PI * 2;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree5.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree5',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Tree5.canPlace = function ( arena, x, z ) {

    return arena.collisionManager.isPlaceFree( { x: x, y: z }, 40, 0 );

};

//

module.exports = Tree5;
