/*
 * @author ohmed
 * Stones3 map decoration
*/

var Stones3 = function ( arena, params ) {

    this.id = Stones3.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Stones3';
    this.init();

};

Stones3.prototype = Object.create( Game.Decoration.prototype );

Stones3.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 20;

    this.arena.collisionManager.addObject( this, 'circle' );

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

module.exports = Stones3;
