/*
 * @authour ohmed
 * Decoration object class
*/

var Decoration = function ( arena, params ) {

    if ( Decoration.numId > 1000 ) Decoration.numId = 0;
    this.id = Decoration.numId ++;

    this.arena = arena;

    this.rotation = params.rotation || 0;
    this.position = params.position || new Game.Vec3();
    this.size = params.size || new Game.Vec3();
    this.scale = params.scale || new Game.Vec3();

    this.name = params.name || '';

};

Decoration.prototype = {};

//

Decoration.numId = 0;

//

module.exports = Decoration;
