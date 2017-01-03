/*
 * @author ohmed
 * DatTank Arena object
*/

Game.Arena = function () {

    this.id = false;
    this.me = false;
    this.currentTime = false;

    //

    this.boxManager = new Game.BoxManager( this );
    this.playerManager = new Game.PlayerManager( this );
    this.teamManager = new Game.TeamManager( this );
    this.towerManager = new Game.TowerManager( this );

};

Game.Arena.prototype = {};

Game.Arena.prototype.init = function ( params ) {

    this.id = params.id;
    this.me = params.me;

    //

    ui.clearKills();
    view.addDecorations( params.decorations );

    this.teamManager.init( params.teams );
    this.playerManager.init( params.players );
    this.boxManager.init( params.boxes );
    this.towerManager.init( params.towers );

    //

    this.currentTime = params.currentTime;

    //

    ui.updateLeaderboard( this.playerManager.players, this.me );
    ui.updateTeamScore( this );

    ui.updateAmmo( this.me.ammo );
    ui.updateHealth( this.me.health );

    //

    setInterval( function () {

        localStorage.setItem( 'lastActiveTime', Date.now() );

    }, 1000 );

};

Game.Arena.prototype.update = function ( time, delta ) {

    for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

        this.playerManager.players[ i ].update( time, delta );

    }

};
