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
    var count, type;

    for ( var decorationName in params ) {

        count = params[ decorationName ].count;
        type = params[ decorationName ].type;

        while ( count ) {

            scale = 5 * Math.random() + 25;
            scaleH = 5 * Math.random() + 30;

            x = 2350 * ( Math.random() - 0.5 );
            z = 2350 * ( Math.random() - 0.5 );

            if ( type.indexOf('Tree') != -1 ) {

                scale = 5 * Math.random() + 12;
                scaleH = 5 * Math.random() + 12;

            }

            if ( type === 'OldCastle' ) {

                scale = 5 * Math.random() + 20;
                scaleH = 15;

            }

            //

            if ( ! this.arena.collisionManager.isPlaceFree( { x: x, y: z }, 20, 0 ) ) continue;

            var placedOnBase = false;

            for ( var i = 0, il = this.arena.teamManager.teams.length; i < il; i ++ ) {

                var spawnPosition = this.arena.teamManager.teams[ i ].spawnPosition;
                var dx = spawnPosition.x - x;
                var dz = spawnPosition.z - z;

                if ( Math.sqrt( dx * dx + dz * dz ) < 150 ) {

                    placedOnBase = true;
                    break;

                }

            }

            if ( placedOnBase ) continue;

            //

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
