/*
 * @author ohmed
 * DatTank Team object
*/

Game.Team = function ( params ) {

    this.id = params.id;

    this.players = [];
    this.kills = params.kills;
    this.death = params.death;
    this.spawnPosition = { x: params.spawnPosition.x, y: params.spawnPosition.y, z: params.spawnPosition.z };

    this.color = Game.Team.colors[ this.id + '' ];
    this.name = Game.Team.names[ this.id + '' ];

};

Game.Team.prototype = {};

//

Game.Team.prototype.addPlayer = function ( player ) {

    this.players = player;

};

Game.Team.prototype.removePlayer = function ( player ) {

    // todo

};

Game.Team.colors = {
    '0':        '#ff0000',
    '1':        '#00ff00',
    '2':        '#0000ff',
    '3':        '#fcaa12',
    '1000':     '#aaaaaa'
};

Game.Team.names = {
    '0':        'Red',
    '1':        'Green',
    '2':        'Blue',
    '3':        'Orange',
    '1000':     'Neutral'
};
