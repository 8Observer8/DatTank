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
    this.pathManager = new Game.PathManager( this, {} );
    this.collisionManager = new Game.CollisionManager( this, {} );

    this.updateInterval = false;
    this.currentTime = false;
    this.prevUpdateTime = Date.now();
    this.totalTime = 0;
    this.loopIter = 0;

    //

    this.init( callback );

};

Arena.prototype = {};

Arena.prototype.init = function ( callback ) {

    this.teamManager.init( 4 );
    this.towerManager.init();
    this.decorationManager.init({
        trees: { type: 'Tree', count: 20 },
        trees1: { type: 'Tree1', count: 10 },
        trees2: { type: 'Tree2', count: 5 },
        trees3: { type: 'Tree3', count: 12 },
        rocks: { type: 'Stones', count: 20 },
        rocks1: { type: 'Stones1', count: 10 },
        rocks2: { type: 'Stones2', count: 10 },
        oldCastle: { type: 'OldCastle', count: 3 }
    });
    this.botManager.init();

    //

    this.updateInterval = setInterval( this.update.bind( this ), 20 );

    //
    
    callback( this ); // will be used in future

};

Arena.prototype.addPlayer = function ( params ) {

    var player = new Game.Player( this, { login: params.login, tank: params.tank, socket: params.socket });
    this.playerManager.add( player );
    this.collisionManager.addPlayer( player );

    //

    this.announce( 'ArenaPlayerJoined', null, player.toPublicJSON() );

    //

    return player;

};

Arena.prototype.removePlayer = function ( player ) {

    if ( this.playerManager.remove( player ) ) {

        player.team.removePlayer( player );

        this.announce( 'ArenaPlayerLeft', null, { id: player.id } );

    }

    //

    for ( var i = this.playerManager.players.length; i < 8; i ++ ) {

        this.botManager.bots.push( new Game.Bot( this ) );

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

Arena.prototype.toPublicJSON = function () {

    return {

        id:             this.id,
        decorations:    this.decorationManager.toJSON(),
        towers:         this.towerManager.toJSON(),
        players:        this.playerManager.toJSON(),
        teams:          this.teamManager.toJSON(),
        boxes:          this.boxManager.toJSON(),
        currentTime:    Date.now()

    };

};

Arena.prototype.update = function () {

    var time = Date.now();
    var delta = time - this.prevUpdateTime;
    this.prevUpdateTime = time;
    this.totalTime += delta;
    this.loopIter ++;
    this.loopIter = ( this.loopIter > 1000000 ) ? 0 : this.loopIter;

    // update managers

    this.playerManager.update( delta, time );
    this.towerManager.update( delta );
    this.collisionManager.update( delta );

    if ( this.loopIter % 5 === 0 ) {

        this.boxManager.update( delta );

    }

};

Arena.numIds = 0;
Arena.NeutralTeam = 1000;

//

module.exports = Arena;
