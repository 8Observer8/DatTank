/*
 * @author ohmed
 * Team manager sys
*/

var TeamManager = function ( arena, params ) {

    this.arena = arena;
    this.teams = [];

};

TeamManager.prototype = {};

TeamManager.prototype.init = function ( teamNum ) {

    teamNum = teamNum || 4;

    for ( var i = 0; i < teamNum; i ++ ) {

        this.add( new Game.Team( i ) );

    }

    this.add( new Game.Team( 1000 ) );

};

TeamManager.prototype.add = function ( team ) {

    this.teams.push( team );

};

TeamManager.prototype.remove = function ( team ) {

    // todo

};

TeamManager.prototype.getWeakest = function () {

    var weakestTeam = this.teams[0];

    for ( var i = 1, il = this.teams.length; i < il; i ++ ) {

        if ( this.teams[ i ].id >= 1000 ) continue;

        if ( weakestTeam.players.length > this.teams[ i ].players.length ) {

            weakestTeam = this.teams[ i ];

        }

    }

    return weakestTeam;

};

TeamManager.prototype.getById = function ( teamId ) {

    for ( var i = 0, il = this.teams.length; i < il; i ++ ) {

        if ( this.teams[ i ].id === teamId ) {

            return this.teams[ i ];

        }

    }

    return false;

};

//

module.exports = TeamManager;
