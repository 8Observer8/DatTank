/*
 * @author ohmed
 * Tree1 map decoration
*/

var Tree1 = function ( arena, params ) {

    this.arena = arena;
    this.id = Tree1.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.radius = 1;
    this.size.set( 0.8, 0.2, 0.8 );
    this.type = 'Tree1';

    this.init();

};

Tree1.prototype = Object.create( Game.Decoration.prototype );

Tree1.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 45;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 65, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.rotation = Math.random() * Math.PI * 2;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree1.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree1',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Tree1.canPlace = function ( arena, x, z ) {

    return arena.collisionManager.isPlaceFree( { x: x, y: z }, 40, 0 );

};

//

module.exports = Tree1;
