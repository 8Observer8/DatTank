/*
 * @author ohmed
 * DatTank Team object
*/

var Team = function ( id ) {

    this.id = id;

    this.players = [];
    this.kills = 0;
    this.death = 0;

    this.position = Team.StartPositions[ this.id + '' ];

};

Team.prototype = {};

Team.prototype.reset = function () {

    this.players = [];

    this.kills = 0;
    this.death = 0;

};

Team.prototype.addPlayer = function ( player ) {

    this.players.push( player );

};

Team.prototype.removePlayer = function ( player ) {

    var newPlayersList = [];

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === player.id ) continue;

        newPlayersList.push( this.players[ i ] );

    }

    this.players = newPlayersList;

};

Team.prototype.toPrivateJSON = function () {

    return {

        id:     this.id,
        kills:  this.kills,
        death:  this.death

    };

};

Team.prototype.toPublicJSON = function () {

    return {

        id:     this.id,
        kills:  this.kills,
        death:  this.death

    };

};

Team.StartPositions = {
    '0':    [   500, 1,   500 ],
    '1':    [ - 500, 1,   500 ],
    '2':    [   500, 1, - 500 ],
    '3':    [ - 500, 1, - 500 ]
};

//

module.exports = Team;
