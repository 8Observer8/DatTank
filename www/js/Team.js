/*
 * @author ohmed
 * DatTank Team object
*/

'use strict';

DT.Team = function ( params ) {

    this.id = params.id ++;

    this.players = [];
    this.kills = params.kills;
    this.death = params.death;

};

DT.Team.prototype = {};

DT.Team.prototype.addPlayer = function ( player ) {

    // todo

};

DT.Team.prototype.removePlayer = function ( player ) {

    // todo

};

DT.Team.colors = [ '#ff0000', '#00ff00', '#0000ff', '#fcaa12' ];
