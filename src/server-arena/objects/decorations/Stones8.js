/*
 * @author ohmed
 * Stones8 map decoration
*/

var Stones8 = function ( arena, params ) {

    this.arena = arena;
    this.id = Stones8.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Stones8';

    this.init();

};

Stones8.prototype = Object.create( Game.Decoration.prototype );

Stones8.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 20;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 20;
    this.rotation = Math.random() * Math.PI * 2;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Stones8.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'stone8',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Stones8.canPlace = function ( arena, x, z ) {

    return arena.collisionManager.isPlaceFree( { x: x, y: z }, 20, 0 );

};

//

module.exports = Stones8;
