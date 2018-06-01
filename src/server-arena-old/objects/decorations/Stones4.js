/*
 * @author ohmed
 * Stones4 map decoration
*/

var Stones4 = function ( arena, params ) {

    this.arena = arena;
    this.id = Stones4.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Stones4';

    this.init();

};

Stones4.prototype = Object.create( Game.Decoration.prototype );

Stones4.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 20;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 20;
    this.rotation = Math.random() * Math.PI * 2;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Stones4.prototype.toJSON = function () {

    return {
        id:         this.id,
        type:       'Rock4',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Stones4.canPlace = function ( arena, x, z ) {

    return arena.collisionManager.isPlaceFree( { x: x, y: z }, 20, 0 );

};

//

module.exports = Stones4;