/*
 * @author ohmed
 * Stones8 map decoration
*/

var Stones8 = function ( arena, params ) {

    this.id = Stones8.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Stones8';
    this.init();

};

Stones8.prototype = Object.create( Game.Decoration.prototype );

Stones8.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 20;

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

module.exports = Stones8;
