/*
 * @author ohmed
 * DatTank Arena object
*/

Game.Arena = function () {

    this.id = false;
    this.me = false;

    //

    this.effects = {
        explosions:     []
    };

    //

    this.boxManager = new Game.BoxManager( this );
    this.playerManager = new Game.PlayerManager( this );
    this.teamManager = new Game.TeamManager( this );
    this.towerManager = new Game.TowerManager( this );
    this.controlsManager = new Game.ControlsManager( this );
    this.chatManager = new Game.ChatManager( this );

};

Game.Arena.prototype = {};

//

Game.Arena.prototype.init = function ( params ) {

    this.id = params.id;

    //

    this.addNetworkListeners();

    //

    view.addDecorations( params.decorations );
    this.initExplosions();

    this.teamManager.init( params.teams );
    this.playerManager.init();
    this.boxManager.init();
    this.towerManager.init();

    //

    this.me = this.addPlayer( params.me );

    //

    ui.updateAmmo( this.me.ammo );
    ui.updateHealth( this.me.health );

    //

    setInterval( function () {

        localStorage.setItem( 'lastActiveTime', Date.now() );

    }, 1000 );

};

Game.Arena.prototype.initExplosions = function () {

    for ( var i = 0; i < 30; i ++ ) {

        var map = resourceManager.getTexture( 'explosion2.png' ).clone();
        map.needsUpdate = true;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( 0.25, 0.25 );
        map.offset.set( 0, 0.75 );

        var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, opacity: 0.7, fog: true });
        var sprite = new THREE.Sprite( material );

        sprite.scale.set( 80, 80, 80 );
        sprite.visible = false;
        view.scene.add( sprite );
        this.effects.explosions.push( sprite );

    }

};

Game.Arena.prototype.showExplosion = function ( params ) {

    for ( var i = 0; i < this.effects.explosions.length; i ++ ) {

        var explosion = this.effects.explosions[ i ];

        if ( ! explosion.visible ) {

            explosion.position.set( params.position.x, params.position.y, params.position.z );
            explosion.scale.set( 80, 80, 80 );
            explosion.visible = true;

            var shooter = this.playerManager.getById( params.ownerId );
            if ( shooter ) {

                shooter = shooter.tank;

            } else {

                shooter = this.towerManager.getById( params.ownerId );

            }

            if ( ! shooter ) continue;

            var bulletsPool = shooter.bullets;
            for ( var j = 0, jl = bulletsPool.length; j < jl; j ++ ) {

                if ( bulletsPool[ j ].id === params.id ) {

                    bulletsPool[ j ].visible = false;
                    break;

                }

            }

            break;

        }

    }

};

Game.Arena.prototype.updateExplosions = function ( delta ) {

    for ( var i = 0; i < this.effects.explosions.length; i ++ ) {

        var explosion = this.effects.explosions[ i ];

        if ( ! explosion.visible ) continue;
        explosion.time = explosion.time || 0;
        explosion.time += delta;

        if ( explosion.time > 50 ) {

            if ( explosion.material.map.offset.y >= 0 ) {

                explosion.material.map.offset.x += 0.25;
                explosion.time = 0;

                if ( explosion.material.map.offset.x === 1 && explosion.material.map.offset.y !== 0 ) {

                    explosion.material.map.offset.x = 0;
                    explosion.material.map.offset.y -= 0.25;

                } else if ( explosion.material.map.offset.y === 0 && explosion.material.map.offset.x === 1 ) {

                    explosion.scale.x = 80;
                    explosion.scale.y = 80;
                    explosion.visible = false;
                    explosion.time = 0;
                    explosion.material.map.offset.set( 0, 1 );

                }

            }

        }

    }

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

Game.Arena.prototype.newBoxesInRange = function ( boxes ) {

    for ( var i = 0, il = boxes.length; i < il; i ++ ) {

        this.boxManager.add( boxes[ i ] );

    }

};

Game.Arena.prototype.boxesOutOfRange = function ( boxes ) {

    for ( var i = 0, il = boxes.length; i < il; i ++ ) {

        this.boxManager.remove( boxes[ i ].id );

    }

};

Game.Arena.prototype.playerLeft = function ( player ) {

    if ( this.playerManager.getById( player.id ) ) {

        this.playerManager.remove( this.playerManager.getById( player.id ) );

    }

};

Game.Arena.prototype.update = function ( time, delta ) {

    this.updateExplosions( delta );

    //

    for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

        this.playerManager.players[ i ].update( time, delta );

    }

};

Game.Arena.prototype.updateLeaderboard = function ( data ) {

    ui.updateLeaderboard( data.players, this.me );
    ui.updateTeamScore( data.teams );

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
    var box = this.boxManager.getBoxById( boxId );
    if ( ! box ) return;

    box.dispatchEvent({ type: eventName, data: data });

};

Game.Arena.prototype.addNetworkListeners = function () {

    network.addMessageListener( 'ArenaPlayerLeft', this.playerLeft.bind( this ) );
    network.addMessageListener( 'ArenaLeaderboardUpdate', this.updateLeaderboard.bind( this ) );

    network.addMessageListener( 'PlayersInRange', this.newPlayersInRange.bind( this ) );
    network.addMessageListener( 'TowersInRange', this.newTowersInRange.bind( this ) );
    network.addMessageListener( 'BoxesInRange', this.newBoxesInRange.bind( this ) );
    network.addMessageListener( 'PlayersOutOfRange', this.playersOutOfRange.bind( this ) );
    network.addMessageListener( 'TowersOutOfRange', this.towersOutOfRange.bind( this ) );
    network.addMessageListener( 'BoxesOutOfRange', this.boxesOutOfRange.bind( this ) );

    //

    network.addMessageListener( 'ArenaPlayerRespawn', this.proxyEventToPlayer.bind( this ) );

    network.addMessageListener( 'PlayerTankRotateTop', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerTankMove', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerTankShoot', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerTankHit', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerTankDied', this.proxyEventToPlayer.bind( this ) );
    network.addMessageListener( 'PlayerGotBox', this.proxyEventToPlayer.bind( this ) );

    //

    network.addMessageListener( 'TowerRotateTop', this.proxyEventToTower.bind( this ) );
    network.addMessageListener( 'TowerShoot', this.proxyEventToTower.bind( this ) );
    network.addMessageListener( 'TowerChangeTeam', this.proxyEventToTower.bind( this ) );
    network.addMessageListener( 'TowerHit', this.proxyEventToTower.bind( this ) );

    network.addMessageListener( 'BulletHit', this.showExplosion.bind( this ) );

    //

    network.addMessageListener( 'RemoveBox', this.proxyEventToBox.bind( this ) );
    network.addMessageListener( 'PickedBox', this.proxyEventToBox.bind( this ) );

    // chatMessage

    network.addMessageListener( 'SendChatMessage', this.proxyEventToPlayer.bind( this ) );

};
