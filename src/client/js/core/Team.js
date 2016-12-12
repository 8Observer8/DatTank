/*
 * @author ohmed
 * DatTank Team object
*/

DT.Team = function ( params ) {

    this.id = params.id;

    this.players = [];
    this.kills = params.kills;
    this.death = params.death;

    this.color = DT.Team.colors[ this.id + '' ];
    this.name = DT.Team.names[ this.id + '' ];

};

DT.Team.prototype = {};

DT.Team.prototype.addPlayer = function ( player ) {

    // todo

};

DT.Team.prototype.removePlayer = function ( player ) {

    // todo

};

DT.Team.colors = {
    '0':        '#ff0000',
    '1':        '#00ff00',
    '2':        '#0000ff',
    '3':        '#fcaa12',
    '1000':     '#aaaaaa'
};

DT.Team.names = {
    '0':        'Red',
    '1':        'Green',
    '2':        'Blue',
    '3':        'Orange',
    '1000':     'Neutral'
};
