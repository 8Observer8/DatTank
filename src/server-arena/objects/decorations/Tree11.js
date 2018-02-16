/*
 * @author ohmed
 * Tree11 map decoration
*/

var Tree11 = function ( arena, params ) {

    this.id = Tree11.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree11';
    this.init();

};

Tree11.prototype = Object.create( Game.Decoration.prototype );

Tree11.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 1;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree11.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree11',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Tree11;
