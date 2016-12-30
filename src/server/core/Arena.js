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

    //

    this.init( callback );

};

Arena.prototype = {};

Arena.prototype.init = function ( callback ) {

    this.teamManager.init( 4 );
    this.towerManager.init();
    this.decorationManager.init({
        trees: { type: 'Tree' count: 190 },
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

    if ( ! player.socket ) {

        Game.Network.announce( this, 'playerJoined', player.toPublicJSON() );

    } else {

        Game.Network.broadcast( player.socket, this, 'playerJoined', player.toPublicJSON() );

    }

};

Arena.prototype.removePlayer = function ( player ) {

    if ( this.playerManager.remove( playerManager ) ) {

        player.team.removePlayer( player );
        Game.Network.announce( this, 'playerLeft', { id: player.id } );

    }

    //

    for ( var i = this.players.length; i < 8; i ++ ) {

        this.bots.push( new Game.Bot( this ) );

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
