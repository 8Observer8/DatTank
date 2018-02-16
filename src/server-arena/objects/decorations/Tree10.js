/*
 * @author ohmed
 * Tree10 map decoration
*/

var Tree10 = function ( arena, params ) {

    this.id = Tree10.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree10';
    this.init();

};

Tree10.prototype = Object.create( Game.Decoration.prototype );

Tree10.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 1;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree10.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree10',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Tree10;
