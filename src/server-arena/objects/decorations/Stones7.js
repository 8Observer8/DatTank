/*
 * @author ohmed
 * Stones7 map decoration
*/

var Stones7 = function ( arena, params ) {

    this.arena = arena;
    this.id = Stones7.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Stones3';

    this.init();

};

Stones7.prototype = Object.create( Game.Decoration.prototype );

Stones7.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 20;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 20;
    this.rotation = Math.random() * Math.PI * 2;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Stones7.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'stone7',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Stones7.canPlace = function ( arena, x, z ) {

    return arena.collisionManager.isPlaceFree( { x: x, y: z }, 20, 0 );

};

//

module.exports = Stones7;
