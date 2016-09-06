/*
 * @author ohmed
 * Arena boxes manager
*/

var BoxManager = function ( arena, params ) {

    params = params || {};

    this.arena = arena;
    this.boxes = [];

    this.boxAVGCount = params.boxAVGCount || 10;

    this.time = 0;

};

BoxManager.prototype = {};

BoxManager.prototype.init = function () {

    // todo

};

BoxManager.prototype.reset = function () {

    this.boxes.length = 0;
    this.time = 0;

    this.init();

};

BoxManager.prototype.addBox = function ( params ) {

    var box = false;

    params.type = params.type || 'Ammo';

    switch ( params.type ) {

        case 'Health':

            box = new DT.Box.Health({
                arena: this.arena,
                position: [ Math.floor( 1500 * ( Math.random() - 0.5 ) ), 20, Math.floor( 1500 * ( Math.random() - 0.5 ) ) ]
            });
            break;

        case 'Ammo':

            box = new DT.Box.Ammo({
                arena: this.arena,
                position: [ Math.floor( 1500 * ( Math.random() - 0.5 ) ), 20, Math.floor( 1500 * ( Math.random() - 0.5 ) ) ]
            });
            break;

        default:

            console.log('Unknown DT Box type.');
            break;

    }

    this.boxes.push( box );

    //

    console.log('Added box [' + params.type + '] to the map.');

};

BoxManager.prototype.removeBox = function ( box ) {

    var newBoxList = [];

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        if ( this.boxes[ i ].id === box.id ) continue;

        newBoxList.push( this.boxes[ i ] );

    }

    this.boxes = newBoxList;

};

BoxManager.prototype.getBoxesInRange = function ( player ) {

    var dx, dz;
    var range = 26;
    var result = [];

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        dx = this.boxes[ i ].position[0] - player.position[0];
        dz = this.boxes[ i ].position[2] - player.position[2];

        if ( Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) < range ) {

            result.push( this.boxes[ i ] );

        }

    }

    return result;

};

BoxManager.prototype.update = function ( delay, players ) {

    this.time += delay;

    //

    if ( this.boxes.length < this.boxAVGCount ) {

        this.addBox({
            type: ( Math.random() > 0.8 ) ? 'Ammo' : 'Health'
        });

    }

    //

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        var boxes = this.getBoxesInRange( players[ i ] );

        for ( var j = 0, jl = boxes.length; j < jl; j ++ ) {

            boxes[ j ].pickUp( players[ i ] );
            this.removeBox( boxes[ j ] );

        }

    }

};

//

module.exports = BoxManager;
