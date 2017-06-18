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
    this.controlsManager = new Game.ControlsManager( this );
    this.chatManager = new Game.ChatManager( this );

};

Game.Arena.prototype = {};

Game.Arena.prototype.init = function ( params ) {

    this.id = params.id;
    this.me = params.me;

    //

    this.addNetworkListeners();

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

Game.Arena.prototype.newPlayerJoined = function ( data ) {

    var player = new Game.Player( this, data );
    this.playerManager.add( player );

};

Game.Arena.prototype.playerLeft = function ( player ) {

    if ( this.playerManager.getById( player.id ) ) {

        this.playerManager.remove( this.playerManager.getById( player.id ) );

    }

    ui.updateLeaderboard( this.playerManager.players, this.me );

};

Game.Arena.prototype.update = function ( time, delta ) {

    for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

        this.playerManager.players[ i ].update( time, delta );

    }

};

Game.Arena.prototype.addBox = function ( data ) {

    this.boxManager.add( data );

};

Game.Arena.prototype.proxyEventToPlayer = function ( data, eventName ) {

    var playerId = ( data.player ) ? data.player.id : data[0];
    var player = this.playerManager.getById( playerId );
    player = ( ! player ) ? this.me : player;

    player.dispatchEvent({ type: eventName, data: data });

};

Game.Arena.prototype.proxyEventToTower = function ( data, eventName ) {

    var tower = this.towerManager.getById( data[0] );
    if ( ! tower ) return;

    tower.dispatchEvent({ type: eventName, data: data });

};

Game.Arena.prototype.proxyEventToBox = function ( data, eventName ) {

    var boxId = ( data.id ) ? data.id : data[0];
    var box = this.boxManager.getById( boxId );
    if ( ! box ) return;

    box.dispatchEvent({ type: eventName, data: data });

};

Game.Arena.prototype.addNetworkListeners = function () {

    network.addMessageListener( 'ArenaPlayerJoined', this.newPlayerJoined.bind( this ) );
    network.addMessageListener( 'ArenaPlayerRespawn', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'ArenaAddBox', this.addBox.bind( this ) );
    network.addMessageListener( 'ArenaPlayerLeft', this.playerLeft.bind( this ) );

    //

    network.addMessageListener( 'PlayerTankRotateTop', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerTankMove', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerTankMoveByPath', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerTankShoot', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerTankHit', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerTankDied', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerGotBox', this.proxyEventToPlayer.bind( this ) );

    //

    network.addMessageListener( 'TowerRotateTop', this.proxyEventToTower.bind( this ) );
    network.addMessageListener( 'TowerShoot', this.proxyEventToTower.bind( this ) );
    network.addMessageListener( 'TowerChangeTeam', this.proxyEventToTower.bind( this ) );
    network.addMessageListener( 'TowerHit', this.proxyEventToTower.bind( this ) );

    network.addMessageListener( 'BulletHit', this.proxyEventToPlayer.bind( this ) );

    //

    network.addMessageListener( 'RemoveBox', this.proxyEventToBox.bind( this ) );
    network.addMessageListener( 'PickedBox', this.proxyEventToBox.bind( this ) );

    // chatMessage

    network.addMessageListener( 'SendChatMessage', this.proxyEventToPlayer.bind( this ) );

};
