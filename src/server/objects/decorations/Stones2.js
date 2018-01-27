/*
 * @authour ohmed
 * Stones map decoration
*/

var Stones2 = function ( arena, params ) {

    this.id = Stones2.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Stones2';
    this.init();

};

Stones2.prototype = Object.create( Game.Decoration.prototype );

Stones2.prototype.init = function () {

    var position = this.position;
    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 5;

    this.arena.pathManager.placeObject( new Game.Vec3( position.x - this.sizeX / 2, 0, position.z - this.sizeZ / 2 ), new Game.Vec3( position.x + this.sizeX / 2, 0, position.z + this.sizeZ / 2 ) );
    this.arena.collisionManager.addObject( this, 'circle' );

};

Stones2.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'rock2',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Stones2;
