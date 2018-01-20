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

    //

    this.addNetworkListeners();

    //

    ui.clearKills();
    view.addDecorations( params.decorations );

    this.teamManager.init( params.teams );
    this.playerManager.init();
    this.boxManager.init( params.boxes );
    this.towerManager.init();

    //

    this.currentTime = params.currentTime;
    this.me = this.addPlayer( params.me );

    //

    ui.updateTeamScore( this );
    ui.updateAmmo( this.me.ammo );
    ui.updateHealth( this.me.health );

    //

    setInterval( function () {

        localStorage.setItem( 'lastActiveTime', Date.now() );

    }, 1000 );

};

Game.Arena.prototype.addPlayer = function ( data ) {

    var player = new Game.Player( this, data );
    this.playerManager.add( player );

    return player;

};

Game.Arena.prototype.newPlayersInRange = function ( players ) {

    var scope = this;

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        scope.addPlayer( players[ i ] );

    }

};

Game.Arena.prototype.playersOutOfRange = function ( players ) {

    var scope = this;

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        scope.playerManager.remove( players[ i ] );

    }

};

Game.Arena.prototype.newTowersInRange = function ( towers ) {

    var scope = this;

    for ( var i = 0, il = towers.length; i < il; i ++ ) {

        scope.towerManager.add( new Game.Tower( scope, towers[ i ] ) );

    }

};

Game.Arena.prototype.towersOutOfRange = function ( towers ) {

    var scope = this;

    for ( var i = 0, il = towers.length; i < il; i ++ ) {

        scope.towerManager.remove( towers[ i ] );

    }

};

Game.Arena.prototype.playerLeft = function ( player ) {

    if ( this.playerManager.getById( player.id ) ) {

        this.playerManager.remove( this.playerManager.getById( player.id ) );

    }

};

Game.Arena.prototype.update = function ( time, delta ) {

    for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

        this.playerManager.players[ i ].update( time, delta );

    }

};

Game.Arena.prototype.addBox = function ( data ) {

    this.boxManager.add( data );

};

Game.Arena.prototype.updateLeaderboard = function ( data ) {

    // todo
    console.log( data );

};

//

Game.Arena.prototype.proxyEventToPlayer = function ( data, eventName ) {

    var playerId = ( data.player ) ? data.player.id : data[0];
    var player = this.playerManager.getById( playerId );

    if ( ! player ) return;
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

    network.addMessageListener( 'ArenaAddBox', this.addBox.bind( this ) );
    network.addMessageListener( 'ArenaPlayerLeft', this.playerLeft.bind( this ) );
    network.addMessageListener( 'ArenaLeaderboardUpdate', this.updateLeaderboard.bind( this ) );

    network.addMessageListener( 'PlayersInRange', this.newPlayersInRange.bind( this ) );
    network.addMessageListener( 'TowersInRange', this.newTowersInRange.bind( this ) );
    network.addMessageListener( 'PlayersOutOfRange', this.playersOutOfRange.bind( this ) );
    network.addMessageListener( 'TowersOutOfRange', this.towersOutOfRange.bind( this ) );

    //

    network.addMessageListener( 'ArenaPlayerRespawn', this.proxyEventToPlayer.bind( this ) );

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
