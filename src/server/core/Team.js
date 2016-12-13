/*
 * @author ohmed
 * DatTank Team object
*/

var Team = function ( id ) {

    this.id = id;

    this.players = [];
    this.kills = 0;
    this.death = 0;

    this.spawnPosition = Team.StartPositions[ this.id + '' ];

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

        id:             this.id,
        kills:          this.kills,
        death:          this.death,
        spawnPosition:  this.spawnPosition

    };

};

Team.prototype.toPublicJSON = function () {

    return {

        id:             this.id,
        kills:          this.kills,
        death:          this.death,
        spawnPosition:  this.spawnPosition

    };

};

Team.StartPositions = {
    '0':    { x:   475, y: 1, z:   475 },
    '1':    { x: - 475, y: 1, z:   475 },
    '2':    { x:   475, y: 1, z: - 475 },
    '3':    { x: - 475, y: 1, z: - 475 },
    '1000': { x:     0, y: 0, z:     0 }
};

//

module.exports = Team;
