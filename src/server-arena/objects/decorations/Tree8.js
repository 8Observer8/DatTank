/*
 * @author ohmed
 * Tree8 map decoration
*/

var Tree8 = function ( arena, params ) {

    this.id = Tree8.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree8';
    this.init();

};

Tree8.prototype = Object.create( Game.Decoration.prototype );

Tree8.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 1;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree8.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree8',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Tree8;
