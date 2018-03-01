/*
 * @author ohmed
 * Stones2 map decoration
*/

var Stones2 = function ( arena, params ) {

    this.arena = arena;
    this.id = Stones2.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 7, 0.8, 2 );
    this.type = 'Stones2';

    this.init();

};

Stones2.prototype = Object.create( Game.Decoration.prototype );

Stones2.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 20;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.rotation = 0;

    this.arena.collisionManager.addObject( this, 'box' );

};

Stones2.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'stone2',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Stones2.canPlace = function ( arena, x, z ) {

    return arena.collisionManager.isPlaceFree( { x: x - 20, y: z }, 20, 0 ) && arena.collisionManager.isPlaceFree( { x: x + 20, y: z }, 20, 0 );

};

//

module.exports = Stones2;
