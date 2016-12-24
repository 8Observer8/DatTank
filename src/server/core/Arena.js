/*
 * @author ohmed
 * DatTank Arena object
*/

var Arena = function () {

    this.id = Arena.numIds ++;

    this.players = [];
    this.teams = [];
    this.room = false;

    this.decorations = [];
    this.bots = [];
    this.towers = [];

    this.boxManager = new DT.BoxManager( this, {} );
    this.pathManager = new DT.PathManager( this, {} );

    this.updateInterval = false;

    // add teams

    for ( var i = 0; i < 4; i ++ ) {

        this.teams.push( new DT.Team( i ) );

    }

    this.teams.push( new DT.Team( 1000 ) );

    // add towers

    for ( var i = 0; i < 5; i ++ ) {

        for ( var j = 0; j < 5; j ++ ) {

            var x = ( 0.5 - i / 4 ) * 1900;
            var z = ( 0.5 - j / 4 ) * 1900;

            this.towers.push( new DT.Tower( this, { team: this.getTeamById( Arena.NeutralTeam ), position: { x: x, y: 0, z: z } } ) );

        }

    }

    //

    this.currentTime = false;

};

Arena.prototype = {};

Arena.prototype.reset = function ( isNew ) {

    var scope = this;

    clearInterval( this.updateInterval );
    this.updateInterval = setInterval( this.update.bind( this ), 20 );

    this.obstacles = [];

    //

    this.boxManager.reset();
    this.addObstacles( 190, 80 );

    //

    for ( var i = 0, il = this.teams.length; i < il; i ++ ) {

        this.teams[ i ].reset();

    }

    for ( var i = 0, il = this.bots.length; i < il; i ++ ) {

        this.bots[ i ].dispose();

    }

    this.players = [];
    this.bots = [];

    //

    setTimeout( function () {

        for ( var i = 0; i < 5 + Math.floor( Math.random() * 5 ); i ++ ) {

            scope.bots.push( new DT.Bot( scope ) );

        }

    }, 1000 );

};

Arena.prototype.addObstacles = function ( treeCount, rockCount ) {

    // tree obstacles

    var x, z;
    var scale, scaleH;
    var baseSize = 140;

    while ( treeCount ) {

        scale = 20 * Math.random() + 25;
        scaleH = 20 * Math.random() + 25;

        x = 2350 * ( Math.random() - 0.5 );
        z = 2350 * ( Math.random() - 0.5 );

        //

        var placedOnTower = false;
        var placedOnBase = false;

        for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

            var tower = this.towers[ i ];

            if ( Math.abs( x - tower.position.x ) + Math.abs( z - tower.position.z ) < 150 ) {

                placedOnTower = true;
                break;

            }

        }

        if ( placedOnTower ) continue;

        //

        for ( var i in DT.Team.StartPositions ) {

            var pos = DT.Team.StartPositions[ i ];

            if ( + i >= 1000 ) continue;
            if ( Math.sqrt( Math.pow( pos.x - x, 2 ) + Math.pow( pos.z - z, 2 ) ) < baseSize ) {

                placedOnBase = true;
                break;

            }

        }

        if ( placedOnBase ) continue;

        //

        var tree = new DT.Decoration.Tree( this, {
            position:   new DT.Vec3( x, 0, z ),
            scale:      new DT.Vec3( scale, scaleH, scale ),
            rotation:   2 * Math.PI * Math.random()
        });

        this.decorations.push( tree );

        treeCount --;

    }

    // rock obstacles

    while ( rockCount ) {

        scale = 30 * Math.random() + 20;
        x = 2000 * ( Math.random() - 0.5 );
        z = 2000 * ( Math.random() - 0.5 );

        //

        var placedOnTower = false;

        for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

            var tower = this.towers[ i ];

            if ( Math.abs( x - tower.position.x ) + Math.abs( z - tower.position.z ) < 150 ) {

                placedOnTower = true;
                break;

            }

        }

        if ( placedOnTower ) continue;

        if ( Math.sqrt( Math.pow( 500 - x, 2 ) + Math.pow( 500 - z, 2 ) ) < baseSize ) continue;
        if ( Math.sqrt( Math.pow( - 500 - x, 2 ) + Math.pow( 500 - z, 2 ) ) < baseSize ) continue;
        if ( Math.sqrt( Math.pow( 500 - x, 2 ) + Math.pow( - 500 - z, 2 ) ) < baseSize ) continue;
        if ( Math.sqrt( Math.pow( - 500 - x, 2 ) + Math.pow( - 500 - z, 2 ) ) < baseSize ) continue;

        var stones = new DT.Decoration.Stones( this, {
            position:   new DT.Vec3( x, 0, z ),
            scale:      new DT.Vec3( scale, scaleH, scale ),
            rotation:   2 * Math.PI * Math.random()
        });

        this.decorations.push( stones );

        rockCount --;

    }

    //

    this.pathManager.constructMap();

};

Arena.prototype.getDecorations = function () {

    var decorations = [];

    for ( var i = 0, il = this.decorations.length; i < il; i ++ ) {

        decorations.push( this.decorations[ i ].toJSON() );

    }

    return decorations;

};

Arena.prototype.getWinnerTeamId = function () {

    var winnerTeam = this.teams[0];

    for ( var i = 1, il = this.teams.length; i < il; i ++ ) {

        if ( winnerTeam.kills < this.teams[ i ].kills ) {

            winnerTeam = this.teams[ i ];

        }

    }

    return winnerTeam.id;

};

Arena.prototype.detectWeakestTeam = function () {

    var weakestTeam = this.teams[0];

    for ( var i = 1, il = this.teams.length; i < il; i ++ ) {

        if ( this.teams[ i ].id >= 1000 ) continue;

        if ( weakestTeam.players.length > this.teams[ i ].players.length ) {

            weakestTeam = this.teams[ i ];

        }

    }

    return weakestTeam;

};

Arena.prototype.getPlayerById = function ( playerId ) {

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === playerId ) {

            return this.players[ i ];

        }

    }

    return false;

};

Arena.prototype.getTeamById = function ( teamId ) {

    for ( var i = 0, il = this.teams.length; i < il; i ++ ) {

        if ( this.teams[ i ].id === teamId ) {

            return this.teams[ i ];

        }

    }

    return false;

};

Arena.prototype.getTowerById = function ( towerId ) {

    for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

        if ( this.towers[ i ].id === towerId ) {

            return this.towers[ i ];

        }

    }

    return false;

};

Arena.prototype.addPlayer = function ( player ) {

    var team = this.detectWeakestTeam();

    team.addPlayer( player );
    this.players.push( player );

    player.arena = this;
    player.team = team;
    player.position.set( team.spawnPosition.x, team.spawnPosition.y, team.spawnPosition.z );

    var offsetX = 0;
    var offsetZ = 0;

    while ( Math.abs( offsetX ) < 50 && Math.abs( offsetZ ) < 50 ) {

        offsetX = ( Math.random() - 0.5 ) * 200;
        offsetZ = ( Math.random() - 0.5 ) * 200;        

    }

    player.position.x += offsetX;
    player.position.z += offsetZ;

    //

    if ( ! player.socket ) {

        DT.Network.announce( this, 'playerJoined', player.toPublicJSON() );

    } else {

        DT.Network.broadcast( player.socket, this, 'playerJoined', player.toPublicJSON() );

    }

};

Arena.prototype.removeBot = function ( player ) {

    var newBotList = [];

    for ( var i = 0, il = this.bots.length; i < il; i ++ ) {

        if ( this.bots[ i ].player.id === player.id ) continue;

        newBotList.push( this.bots[ i ] );

    }

    player.bot.dispose();

    this.bots = newBotList;

};

Arena.prototype.removePlayer = function ( player ) {

    var newPlayersList = [];
    var removed = true;

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        if ( this.players[ i ].id === player.id ) {

            removed = true;
            continue;

        }

        newPlayersList.push( this.players[ i ] );

    }

    this.players = newPlayersList;

    //

    if ( removed ) {

        player.team.removePlayer( player );
        DT.Network.announce( this, 'playerLeft', { id: player.id } );

    }

    //

    for ( var i = this.players.length; i < 8; i ++ ) {

        this.bots.push( new DT.Bot( this ) );

    }

};

Arena.prototype.toPublicJSON = function () {

    var players = [];
    var teams = [];
    var boxes = [];
    var towers = [];

    for ( var i = 0, il = this.players.length; i < il; i ++ ) {

        players.push( this.players[ i ].toPublicJSON() );

    }

    for ( var i = 0, il = this.teams.length; i < il; i ++ ) {

        teams.push( this.teams[ i ].toPublicJSON() );

    }

    for ( var i = 0, il = this.boxManager.boxes.length; i < il; i ++ ) {

        boxes.push( this.boxManager.boxes[ i ].toJSON() );

    }

    for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

        towers.push( this.towers[ i ].toJSON() );

    }

    //

    return {

        id:             this.id,
        obstacles:      this.getDecorations(),
        towers:         towers,
        players:        players,
        teams:          teams,
        boxes:          boxes,
        currentTime:    Date.now()

    };

};

Arena.prototype.update = (function () {

    var prevUpdateTime = false;

    return function () {

        var time = Date.now();
        var delta = ( prevUpdateTime !== false ) ? time - prevUpdateTime : 0;
        prevUpdateTime = time;

        // update towers

        for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

            this.towers[ i ].update( delta );

        }

        // update players position & rotation

        for ( var i = 0, il = this.players.length; i < il; i ++ ) {

            this.players[ i ].update( delta, time );

        }

        this.boxManager.update( delta, this.players );

    };

}) ();

Arena.numIds = 0;
Arena.NeutralTeam = 1000;

//

module.exports = Arena;
