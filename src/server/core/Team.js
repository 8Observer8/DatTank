/*
 * @author ohmed
 * DatTank Team object
*/

var Team = function ( id ) {

    this.id = id;

    this.players = [];
    this.kills = 0;
    this.death = 0;
    this.towers = 1;

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
    player.team = this;

    //

    player.position.set( this.spawnPosition.x, this.spawnPosition.y, this.spawnPosition.z );

    var offsetX = 0;
    var offsetZ = 0;

    while ( Math.abs( offsetX ) < 65 || Math.abs( offsetZ ) < 65 ) {

        offsetX = ( Math.random() - 0.5 ) * 200;
        offsetZ = ( Math.random() - 0.5 ) * 200;

    }

    player.position.x += offsetX;
    player.position.z += offsetZ;

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
    '0':    { x:   950, y: 1, z:   950 },
    '1':    { x: - 950, y: 1, z:   950 },
    '2':    { x:   950, y: 1, z: - 950 },
    '3':    { x: - 950, y: 1, z: - 950 },
    '1000': { x:     0, y: 0, z:     0 }
};

//

module.exports = Team;
