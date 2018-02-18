/*
 * @author ohmed
 * Tree6 map decoration
*/

var Tree6 = function ( arena, params ) {

    this.id = Tree6.numIds ++;
    Game.Decoration.call( this, arena, params );

    this.size.set( 0.8, 0.8, 0.8 );
    this.type = 'Tree6';
    this.init();

};

Tree6.prototype = Object.create( Game.Decoration.prototype );

Tree6.prototype.init = function () {

    this.sizeX = this.size.x * this.scale.x;
    this.sizeY = this.size.y * this.scale.y;
    this.sizeZ = this.size.z * this.scale.z;
    this.radius = 0.5;

    this.arena.collisionManager.addObject( this, 'circle' );

};

Tree6.prototype.toJSON = function () {

    return {
        id:         this.id,
        name:       this.name,
        type:       'tree6',
        position:   this.position.toJSON(),
        rotation:   this.rotation,
        scale:      this.scale.toJSON()
    };

};

//

module.exports = Tree6;
