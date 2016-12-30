/*
 * @author ohmed
 * Tower manager sys
*/

var TowerManager = function ( arena, params ) {

    this.arena = arena;
    this.towers = [];

};

TowerManager.prototype = {};

TowerManager.prototype.init = function () {

    var team = this.arena.teamManager.getById( Game.Arena.NeutralTeam );

    for ( var i = 0; i < 5; i ++ ) {

        for ( var j = 0; j < 5; j ++ ) {

            var x = ( 0.5 - i / 4 ) * 1900;
            var z = ( 0.5 - j / 4 ) * 1900;

            this.add( new DT.Tower( this, { team: team, position: { x: x, y: 0, z: z } } ) );

        }

    }

};

TowerManager.prototype.add = function ( tower ) {

    this.towers.push( tower );

};

TowerManager.prototype.remove = function ( tower ) {

    // todo

};

TowerManager.prototype.getById = function ( towerId ) {

    for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

        if ( this.towers[ i ].id === towerId ) {

            return this.towers[ i ];

        }

    }

    return false;

};

//

module.exports = TowerManager;
