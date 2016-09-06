/*
 * @author ohmed
 * Box main class
*/

var Box = function ( params ) {

    params = params || {};

    this.id = Box.numId ++;
    this.arena = params.arena;

    this.position = params.position || [ 0, 20, 0 ];

    this.amount = 0;
    this.duration = 0;
    this.type = 'none';

};

Box.prototype = {};

Box.prototype.init = function () {

    DT.Network.announce( this.arena.room, 'addBox', this.toPublicJSON() );

};

Box.prototype.toPublicJSON = function () {

    return {
        id:         this.id,
        type:       this.type,
        amount:     this.amount,
        duration:   this.duration,
        position:   this.position
    };

};

Box.numId = 0;

//

module.exports = Box;
