/*
 * @author ohmed
 * Stones1 map decoration
*/

var Stones1 = function ( arena, params ) {

    this.id = Stones1.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Stones1';
    this.init();

};

Stones1.prototype = Object.create( Game.Decoration.prototype );

Stones1.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 5;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Stones1.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'stone1',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Stones1;