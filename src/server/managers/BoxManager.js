/*
 * @author ohmed
 * Arena boxes manager
*/

var BoxManager = function ( arena, params ) {

    this.arena = arena;
    this.boxes = [];
    this.boxAVGCount = params.boxAVGCount || 25;
    this.time = 0;

};

BoxManager.prototype = {};

//

BoxManager.prototype.add = function ( params ) {

    var box = false;
    var position = false;

    params.type = params.type || 'Ammo';

    while ( ! position || ! this.arena.collisionManager.isPlaceFree( { x: position.x, y: position.y }, 20 ) ) {

        position = new Game.Vec3( Math.floor( 2000 * ( Math.random() - 0.5 ) ), 20, Math.floor( 2000 * ( Math.random() - 0.5 ) ) );

    }

    //

    switch ( params.type ) {

        case 'Health':

            box = new Game.Box.Health( this.arena, { position: position });
            break;

        case 'Ammo':

            box = new Game.Box.Ammo( this.arena, { position: position });
            break;

        default:

            console.log('Unknown Game Box type.');
            break;

    }

    this.boxes.push( box );

};

BoxManager.prototype.remove = function ( box ) {

    var newBoxList = [];

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        if ( this.boxes[ i ].id === box.id ) continue;

        newBoxList.push( this.boxes[ i ] );

    }

    this.boxes = newBoxList;

};

BoxManager.prototype.getInRange = function ( player ) {

    var dx, dz;
    var range = 40;
    var result = [];

    for ( var i = 0, il = this.boxes.length; i < il; i ++ ) {

        dx = this.boxes[ i ].position.x - player.position.x;
        dz = this.boxes[ i ].position.z - player.position.z;

        if ( Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) < range ) {

            result.push( this.boxes[ i ] );

        }

    }

    return result;

};

BoxManager.prototype.update = function ( delay ) {

    var players = this.arena.playerManager.players;

    this.time += delay;

    //

    if ( this.boxes.length < this.boxAVGCount ) {

        this.add({
            type: ( Math.random() > 0.4 ) ? 'Ammo' : 'Health'
        });

    }

    //

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        var boxes = this.getInRange( players[ i ] );

        for ( var j = 0, jl = boxes.length; j < jl; j ++ ) {

            boxes[ j ].pickUp( players[ i ] );
            this.remove( boxes[ j ] );

        }

    }

};

//

module.exports = BoxManager;
