/*
 * @author ohmed
 * Tower manager sys
*/

Game.TowerManager = function ( arena ) {

    this.arena = arena;
    this.towers = [];

};

Game.TowerManager.prototype = {};

Game.TowerManager.prototype.init = function ( params ) {

    for ( var i = 0, il = params.length; i < il; i ++ ) {

        this.add( new Game.Tower( this.arena, params[ i ] ) );

    }

};

Game.TowerManager.prototype.add = function ( tower ) {

    this.towers.push( tower );

};

Game.TowerManager.prototype.remove = function ( tower ) {

    // todo

};

Game.TowerManager.prototype.getById = function ( towerId ) {

    for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

        if ( this.towers[ i ].id === towerId ) {

            return this.towers[ i ];

        }

    }

    return false;

};
