/*
 * @author ohmed
 * Decoration manager sys
*/

var DecorationManager = function ( arena, params ) {

    this.arena = arena;
    this.decorations = [];

};

DecorationManager.prototype = {};

//

DecorationManager.prototype.init = function ( params ) {

    var x, z;
    var scale, scaleH;
    var baseSize = 200;
    var count, type;
    var towers = this.arena.towerManager.towers;

    for ( var decorationName in params ) {

        count = params[ decorationName ].count;
        type = params[ decorationName ].type;

        while ( count ) {

            scale = 5 * Math.random() + 25;
            scaleH = 5 * Math.random() + 50;

            x = 2350 * ( Math.random() - 0.5 );
            z = 2350 * ( Math.random() - 0.5 );

            if ( type === 'OldCastle' ) {

                scale = 5 * Math.random() + 50;

            }

            if ( type === 'Stone1' ) {

                scale = 5 * Math.random() + 30;

            }

            //

            if ( ! this.arena.collisionManager.isPlaceFree( { x: x, y: z }, 20, 0 ) ) continue;

            var decoration = new Game.Decoration[ type ]( this.arena, {
                position:   new Game.Vec3( x, 0, z ),
                scale:      new Game.Vec3( scale, scaleH, scale ),
                rotation:   2 * Math.PI * Math.random()
            });

            this.decorations.push( decoration );

            //

            count --;

        }

    }

};

DecorationManager.prototype.add = function ( decoration ) {

    this.decorations.push( decoration );

};

DecorationManager.prototype.toJSON = function () {

    var decorations = [];

    for ( var i = 0, il = this.decorations.length; i < il; i ++ ) {

        decorations.push( this.decorations[ i ].toJSON() );

    }

    return decorations;

};

//

module.exports = DecorationManager;
