/*
 * @author ohmed
 * Tree9 map decoration
*/

var Tree9 = function ( arena, params ) {

    this.id = Tree9.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree9';
    this.init();

};

Tree9.prototype = Object.create( Game.Decoration.prototype );

Tree9.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 1;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree9.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree9',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Tree9;
