/*
 * @author ohmed
 * Tree4 map decoration
*/

var Tree4 = function ( arena, params ) {

    this.arena = arena;
    this.id = Tree4.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.radius = 0.5;
    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree4';

    this.init();

};

Tree4.prototype = Object.create( Game.Decoration.prototype );

Tree4.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 12;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 12, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.rotation = Math.random() * Math.PI * 2;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree4.prototype.toJSON = function () {

    return {
        id:         this.id,
        type:       'Tree4',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Tree4.canPlace = function ( arena, x, z ) {

    return arena.collisionManager.isPlaceFree( { x: x, y: z }, 40, 0 );

};

//

module.exports = Tree4;
