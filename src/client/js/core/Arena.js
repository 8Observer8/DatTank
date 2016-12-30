/*
 * @author ohmed
 * DatTank Arena object
*/

Game.Arena = function () {

    this.me = false;

    this.boxManager = new Game.BoxManager( this );
    this.playerManager = new Game.PlayerManager( this );
    this.teamManager = new Game.TeamManager( this );
    this.towerManager = new Game.TowerManager( this );

    //

    this.currentTime = false;

};

Game.Arena.prototype = {};

Game.Arena.prototype.init = function ( params ) {

    this.id = params.id;
    this.reset( params );

    setInterval( function () {

        localStorage.setItem( 'lastActiveTime', Date.now() );

    }, 1000 );

};

Game.Arena.prototype.reset = function ( params ) {

    this.me = ( params.me !== undefined ) ? params.me : false;

    // init obstacles

    ui.clearKills();

    view.addObsticles( params.obstacles );

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

};
