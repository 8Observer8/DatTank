/*
 * @authour ohmed
 * Stones map decoration
*/

var Stones = function ( arena, params ) {

    this.id = Stones.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Stones';
    this.init();

};

Stones.prototype = Object.create( Game.Decoration.prototype );

Stones.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 5;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Stones.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'rock',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Stones;
