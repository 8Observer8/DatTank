/*
 * @author ohmed
 * Team manager sys
*/

Game.TeamManager = function ( arena ) {

    this.arena = arena;
    this.teams = [];

};

Game.TeamManager.prototype = {};

//

Game.TeamManager.prototype.init = function ( params ) {

    for ( var i = 0, il = params.length; i < il; i ++ ) {

        this.add( new Game.Team( params[ i ] ) );

    }

};

Game.TeamManager.prototype.add = function ( team ) {

    this.teams.push( team );

};

Game.TeamManager.prototype.remove = function ( team ) {

    // todo

};

Game.TeamManager.prototype.getById = function ( teamId ) {

    for ( var i = 0, il = this.teams.length; i < il; i ++ ) {

        if ( this.teams[ i ].id === teamId ) {

            return this.teams[ i ];

        }

    }

    return false;

};
