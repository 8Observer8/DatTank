/*
 * @author ohmed
 * Box main class
*/

var Box = function ( arena, params ) {

    params = params || {};

    this.id = Box.numId ++;
    this.arena = arena;

    this.position = new Game.Vec3( params.position.x, params.position.y, params.position.z ) || new Game.Vec3( 0, 20, 0 );

    this.amount = 0;
    this.duration = 0;
    this.type = 'none';

};

Box.prototype = {};

Box.prototype.init = function () {

    this.arena.announce( 'AddBox', null, this.toJSON() );

};

Box.prototype.toJSON = function () {

    return {
        id:         this.id,
        type:       this.type,
        amount:     this.amount,
        duration:   this.duration,
        position:   this.position.toJSON()
    };

};

Box.numId = 0;

//

module.exports = Box;
