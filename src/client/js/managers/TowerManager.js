/*
 * @author ohmed
 * Tower manager sys
*/

Game.TowerManager = function ( arena ) {

    this.arena = arena;
    this.towers = [];

};

Game.TowerManager.prototype = {};

Game.TowerManager.prototype.init = function () {};

Game.TowerManager.prototype.add = function ( tower ) {

    this.towers.push( tower );

};

Game.TowerManager.prototype.remove = function ( tower ) {

    var newTowerList = [];
    tower = this.getById( tower.id );

    for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

        if ( this.towers[ i ].id === tower.id ) continue;

        newTowerList.push( this.towers[ i ] );

    }

    tower.dispose();

    this.towers = newTowerList;

};

Game.TowerManager.prototype.getById = function ( towerId ) {

    for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

        if ( this.towers[ i ].id === towerId ) {

            return this.towers[ i ];

        }

    }

    return false;

};
