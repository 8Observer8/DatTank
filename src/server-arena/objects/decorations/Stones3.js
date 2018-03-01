/*
 * @author ohmed
 * Stones3 map decoration
*/

var Stones3 = function ( arena, params ) {

    this.arena = arena;
    this.id = Stones3.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.02, 0.8 );
    this.type = 'Stones3';

    this.init();

};

Stones3.prototype = Object.create( Game.Decoration.prototype );

Stones3.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 20;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.rotation = Math.random() * Math.PI * 2;

};

Stones3.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'stone3',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

Stones3.canPlace = function ( arena, x, z ) {

    return true;

};

//

module.exports = Stones3;
