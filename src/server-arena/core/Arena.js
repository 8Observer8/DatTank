/*
 * @author ohmed
 * DatTank Arena object
*/

var Arena = function ( callback ) {

    if ( Arena.numIds > 1000 ) Arena.numIds = 0;
    this.id = Arena.numIds ++;

    this.teamManager = new Game.TeamManager( this, {} );
    this.playerManager = new Game.PlayerManager( this, {} );
    this.towerManager = new Game.TowerManager( this, {} );
    this.decorationManager = new Game.DecorationManager( this, {} );
    this.botManager = new Game.BotManager( this, {} );
    this.boxManager = new Game.BoxManager( this, {} );
    this.collisionManager = new Game.CollisionManager( this, {} );

    this.updateInterval = false;
    this.currentTime = false;
    this.prevUpdateTime = Date.now();
    this.loopIter = 0;
    this.disposed = false;

    this.leaderboardUpdateTimeout = false;

    //

    this.init( callback );

};

Arena.prototype = {};

//

Arena.prototype.init = function ( callback ) {

    this.teamManager.init( 4 );
    this.towerManager.init();
    this.decorationManager.init({
        trees1:     { type: 'Tree1', count: 5 },
        trees2:     { type: 'Tree2', count: 10 },
        trees3:     { type: 'Tree3', count: 5 },
        trees4:     { type: 'Tree4', count: 10 },
        trees5:     { type: 'Tree5', count: 50 },
        trees6:     { type: 'Tree6', count: 0 }, // too small fiew tree
        trees7:     { type: 'Tree7', count: 20 },
        trees8:     { type: 'Tree8', count: 60 },
        trees9:     { type: 'Tree9', count: 0 }, // too small broken tree
        trees10:    { type: 'Tree10', count: 60 },
        stones1:    { type: 'Stones1', count: 20 },
        stones2:    { type: 'Stones2', count: 10 },
        stones3:    { type: 'Stones3', count: 10 },
        stones4:    { type: 'Stones4', count: 2 },
        oldCastle:  { type: 'OldCastle', count: 3 }
    });
    this.botManager.init();
    this.boxManager.init();

    //

    this.updateInterval = setInterval( this.update.bind( this ), 40 );

    //

    callback( this );

};

Arena.prototype.addPlayer = function ( params ) {

    var scope = this;
    var player = new Game.Player( this, { login: params.login, tank: params.tank, socket: params.socket });
    this.playerManager.add( player );

    //

    if ( ! this.disposed ) {

        scope.updateLeaderboard();

    }

    //

    return player;

};

Arena.prototype.removePlayer = function ( player ) {

    var scope = this;

    if ( this.playerManager.remove( player ) ) {

        player.team.removePlayer( player );
        player.dispose();
        this.announce( 'ArenaPlayerLeft', null, { id: player.id } );

    }

    //

    for ( var i = this.playerManager.players.length; i < this.botManager.botNum; i ++ ) {

        this.botManager.bots.push( new Game.Bot( this ) );

    }

    //

    Game.ArenaManager.removeEmptyArenas();

    //

    if ( ! this.disposed ) {

        scope.updateLeaderboard();

    }

};

Arena.prototype.sendEventToPlayersInRange = function ( position, event, buffer, bufferView ) {

    for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

        var player = this.playerManager.players[ i ];
        var dx = position.x - player.position.x;
        var dy = position.z - player.position.z;

        if ( Math.sqrt( dx * dx + dy * dy ) > 600 ) continue;
        if ( ! player.socket ) continue;

        networkManager.send( event, player.socket, buffer, bufferView );

    }

};

Arena.prototype.announce = function ( eventName, data, view, players ) {

    players = players || this.playerManager.players;

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        if ( players[ i ].socket ) {

            networkManager.send( eventName, players[ i ].socket, data, view );

        }

    }

};

Arena.prototype.updateLeaderboard = function () {

    function update () {

        if ( this.disposed ) return;

        var players = [];
        var teams = [];

        //

        function sortByProperty ( array, property ) {

            for ( var i = 0; i < array.length; i ++ ) {

                for ( var j = i; j < array.length; j ++ ) {

                    if ( array[ i ][ property ] < array[ j ][ property ] ) {

                        var tmp = array[ i ];
                        array[ i ] = array[ j ];
                        array[ j ] = tmp;

                    }

                }

            }

            return array;

        };

        //

        sortByProperty( this.playerManager.players, 'kills' );

        for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

            players.push({
                id:         this.playerManager.players[ i ].id,
                login:      this.playerManager.players[ i ].login,
                team:       this.playerManager.players[ i ].team.id,
                kills:      this.playerManager.players[ i ].kills,
                death:      this.playerManager.players[ i ].death
            });

        }

        //

        for ( var i = 0, il = this.teamManager.teams.length; i < il; i ++ ) {

            if ( this.teamManager.teams[ i ].id === 1000 ) continue;

            teams.push({
                id:         this.teamManager.teams[ i ].id,
                score:      Math.floor( 100 * this.teamManager.teams[ i ].towers / this.towerManager.towers.length )
            });

        }

        //

        this.announce( 'ArenaLeaderboardUpdate', null, { players: players, teams: teams } );

    };

    //

    clearTimeout( this.leaderboardUpdateTimeout );
    this.leaderboardUpdateTimeout = setTimeout( update.bind( this ), 1000 );

};

Arena.prototype.update = function () {

    var time = Date.now();
    var delta = time - this.prevUpdateTime;
    this.prevUpdateTime = time;
    this.loopIter ++;
    this.loopIter = ( this.loopIter > 1000000 ) ? 0 : this.loopIter;

    // update managers

    this.playerManager.update( delta, time );
    this.towerManager.update( delta, time );

    this.collisionManager.update( delta / 3, time );
    this.collisionManager.update( delta / 3, time );
    this.collisionManager.update( delta / 3, time );

    if ( this.loopIter % 5 === 0 ) {

        this.boxManager.update( delta, time );

    }

};

Arena.prototype.toJSON = function () {

    return {

        id:             this.id,
        decorations:    this.decorationManager.toJSON(),
        teams:          this.teamManager.toJSON(),
        currentTime:    Date.now()

    };

};

Arena.prototype.clear = function () {

    clearInterval( this.updateInterval );
    this.collisionManager.clear();

    //

    this.teamManager = false;
    this.playerManager = false;
    this.towerManager = false;
    this.decorationManager = false;
    this.botManager = false;
    this.boxManager = false;
    this.collisionManager = false;

    this.disposed = true;

};

//

Arena.numIds = 0;
Arena.NeutralTeam = 1000;

//

module.exports = Arena;