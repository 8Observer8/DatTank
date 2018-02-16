/*
 * @author ohmed
 * Tree5 map decoration
*/

var Tree5 = function ( arena, params ) {

    this.id = Tree5.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree5';
    this.init();

};

Tree5.prototype = Object.create( Game.Decoration.prototype );

Tree5.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 1;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree5.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree5',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Tree5;
