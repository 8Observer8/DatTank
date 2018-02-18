/*
 * @author ohmed
 * Tree4 map decoration
*/

var Tree4 = function ( arena, params ) {

    this.id = Tree4.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree4';
    this.init();

};

Tree4.prototype = Object.create( Game.Decoration.prototype );

Tree4.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 0.5;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree4.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree4',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Tree4;
