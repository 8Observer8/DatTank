/*
 * @author ohmed
 * Stones6 map decoration
*/

var Stones6 = function ( arena, params ) {

    this.id = Stones6.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Stones6';
    this.init();

};

Stones6.prototype = Object.create( Game.Decoration.prototype );

Stones6.prototype.init = function () {

    var sizeXZ = 5 * Math.random() + 20;
    this.scale = new Game.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 20;
    this.rotation = Math.random() * Math.PI * 2;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Stones6.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'stone6',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Stones6;
