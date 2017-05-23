/*
 * @author ohmed
 * Decoration manager sys
*/

var DecorationManager = function ( arena, params ) {

    this.arena = arena;
    this.decorations = [];

};

DecorationManager.prototype = {};

DecorationManager.prototype.init = function ( params ) {

    var x, z;
    var scale, scaleH;
    var baseSize = 200;

    var towers = this.arena.towerManager.towers;

    for ( var decorationName in params ) {

        var count = params[ decorationName ].count;
        var type = params[ decorationName ].type;

        while ( count ) {

            scale = 5 * Math.random() + 5;
            scaleH = 5 * Math.random() + 5;

            x = 2350 * ( Math.random() - 0.5 );
            z = 2350 * ( Math.random() - 0.5 );

            //

            var placedOnTower = false;
            var placedOnBase = false;
            var placedOnMapDecor = false;

            for ( var i = 0, il = towers.length; i < il; i ++ ) {

                var tower = towers[ i ];

                if ( Math.abs( x - tower.position.x ) + Math.abs( z - tower.position.z ) < 150 ) {

                    placedOnTower = true;
                    break;

                }

            }

            if ( placedOnTower ) continue;

            //

            for ( var i in Game.Team.StartPositions ) {

                var pos = Game.Team.StartPositions[ i ];

                if ( + i >= 1000 ) continue;
                if ( Math.sqrt( Math.pow( pos.x - x, 2 ) + Math.pow( pos.z - z, 2 ) ) < baseSize ) {

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

            for ( var i = 0, il = this.decorations.length; i < il; i ++ ) {

                var decor = this.decorations[ i ];

                if ( Math.abs( x - decor.position.x ) + Math.abs( z - decor.position.z ) < 50 ) {

                    placedOnMapDecor = true;
                    break;

                }

            }

            if ( placedOnMapDecor ) continue;

            this.decorations.push( decoration );
            // console.log( decoration.id, decoration.position, decoration.rotation, decoration.scale );

            //

            count --;

        }

    }

    //

    this.arena.pathManager.constructMap();

};

DecorationManager.prototype.add = function ( decoration ) {

    this.decorations.push( decoration );

};

DecorationManager.prototype.remove = function ( decoration ) {

    // todo

};

DecorationManager.prototype.getById = function ( decorationId ) {

    // todo

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
