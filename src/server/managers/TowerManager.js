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

            this.add( new Game.Tower( this.arena, { team: team, position: { x: x, y: 0, z: z } } ) );

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

TowerManager.prototype.update = function ( delta ) {

    for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

        this.towers[ i ].update( delta );

    }

};

TowerManager.prototype.toJSON = function () {

    var towers = [];

    for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

        towers.push( this.towers[ i ].toJSON() );

    }

    return towers;

};

//

module.exports = TowerManager;
