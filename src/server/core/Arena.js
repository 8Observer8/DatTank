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

    this.updateInterval = false;
    this.currentTime = false;
    this.prevUpdateTime = Date.now();

    //

    this.init( callback );

};

Arena.prototype = {};

Arena.prototype.init = function ( callback ) {

    this.teamManager.init( 4 );
    this.towerManager.init();
    this.decorationManager.init({
        trees: { type: 'Tree', count: 190 },
        rocks: { type: 'Stones', count: 80 }
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

    //

    this.announce( 'playerJoined', player.toPublicJSON() );

    //

    return player;

};

Arena.prototype.removePlayer = function ( player ) {

    if ( this.playerManager.remove( player ) ) {

        player.team.removePlayer( player );
        this.announce( 'playerLeft', { id: player.id } );

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

            Game.Network.send( players[ i ].socket, eventName, data, view );

        }

    }

};

Arena.prototype.toPublicJSON = function () {

    var players = this.playerManager.toJSON();
    var teams = this.teamManager.toJSON();
    var boxes = this.boxManager.toJSON();
    var towers = this.towerManager.toJSON();
    var decorations = this.decorationManager.toJSON();

    //

    return {

        id:             this.id,
        obstacles:      decorations,
        towers:         towers,
        players:        players,
        teams:          teams,
        boxes:          boxes,
        currentTime:    Date.now()

    };

};

Arena.prototype.update = function () {

    var time = Date.now();
    var delta = time - this.prevUpdateTime;
    this.prevUpdateTime = time;

    // update towers

    this.towerManager.update( delta );
    this.playerManager.update( delta, time );
    this.boxManager.update( delta );

};

Arena.numIds = 0;
Arena.NeutralTeam = 1000;

//

module.exports = Arena;
