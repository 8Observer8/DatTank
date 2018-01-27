/*
 * @author ohmed
 * DatTank Player object
*/

var Player = function ( arena, params ) {

    params = params || {};

    Game.EventDispatcher.call( this );

    if ( Player.numIds > 1000 ) Player.numIds = 0;

    this.id = Player.numIds ++;
    this.login = params.login || 'guest';

    this.moveDirection = new Game.Vec2();
    this.moveSpeed = 0.09;
    this.originalMoveSpead = this.moveSpeed;

    this.status = Player.Alive;

    this.socket = params.socket || false;

    if ( this.socket ) {

        this.socket.player = this;
        this.socket.arena = arena;

    }

    this.sizeX = 40;
    this.sizeZ = 50;

    this.bulletsPool = [];

    this.disable = false;

    this.arena = arena || false;
    this.team = false;
    this.health = 100;
    this.kills = 0;
    this.death = 0;

    this.collisionBox = false;

    this.afkTimeout = false;
    this.moveDelay = false;
    this.shootTimeout = false;

    this.position = new Game.Vec3();
    this.deltaPosition = new Game.Vec3();
    this.rotation = 0;
    this.rotationTop = - Math.PI / 2;
    this.lastUpdatedTopRotation = - Math.PI / 2;

    this.selectTank( params.tank );

    this.networkBuffers = {};
    this.inRangeOf = {};
    this.viewRange = 550;

    //

    this.initBulletPool();
    this.addEventListeners();

    this.type = 'Player';

};

Player.prototype = Object.create( Game.EventDispatcher.prototype );

//

Player.prototype.initBulletPool = function () {

    for ( var i = 0; i < 10; i ++ ) {

        this.bulletsPool.push( new Game.Bullet( this.arena, this.id ) );

    }

};

Player.prototype.getInactiveBullet = function () {

    for ( var i = 0; i < this.bulletsPool.length; i ++ ) {

        if ( ! this.bulletsPool[ i ].active ) {

            return this.bulletsPool[ i ];

        }

    }

    return false;

};

Player.prototype.respawn = function ( tankName ) {

    this.status = Player.Alive;
    this.health = 100;
    this.ammo = this.tank.maxShells;
    this.position.set( this.team.spawnPosition.x, this.team.spawnPosition.y, this.team.spawnPosition.z );
    this.rotation = 0;
    this.rotationTop = 0;
    this.bullets = [];

    //

    var offsetX = 0;
    var offsetZ = 0;

    while ( Math.sqrt( offsetX * offsetX + offsetZ * offsetZ ) < 80 ) {

        offsetX = ( Math.random() - 0.5 ) * 150;
        offsetZ = ( Math.random() - 0.5 ) * 150;

    }

    this.position.x += offsetX;
    this.position.z += offsetZ;

    if ( tankName ) this.selectTank( tankName );
    this.arena.updateLeaderboard();

    //

    networkManager.send( 'ArenaPlayerRespawn', this.socket, false, { player: this.toPrivateJSON() } );

};

Player.prototype.selectTank = function ( tankName ) {

    switch ( tankName ) {

        case 'USAT54':

            this.tank = new Game.Tank.USAT54();
            break;

        case 'UKBlackPrince':

            this.tank = new Game.Tank.UKBlackPrince();
            break;

        case 'D32':

            this.tank = new Game.Tank.D32();
            break;

        default:

            this.tank = new Game.Tank.USAT54();
            break;

    }

    this.moveSpeed = this.originalMoveSpead * this.tank.speed / 40;
    this.ammo = this.tank.maxShells;

};

Player.prototype.rotateTop = function ( angle ) {

    var scope = this;

    scope.networkBuffers['rotateTop'] = scope.networkBuffers['rotateTop'] || {};
    var buffer = scope.networkBuffers['rotateTop'].buffer || new ArrayBuffer( 6 );
    var bufferView = scope.networkBuffers['rotateTop'].bufferView || new Uint16Array( buffer );
    scope.networkBuffers['rotateTop'].buffer = buffer;
    scope.networkBuffers['rotateTop'].bufferView = bufferView;

    //

    if ( scope.status !== Player.Alive ) {

        return;

    }

    scope.rotationTop = angle;

    bufferView[1] = scope.id;
    bufferView[2] = Math.floor( 1000 * angle );

    scope.sendEventToPlayersInRange( 'PlayerTankRotateTop', buffer, bufferView );
    scope.lastUpdatedTopRotation = angle;

};

Player.prototype.move = function ( directionX, directionZ ) {

    var scope = this;

    scope.networkBuffers['move'] = scope.networkBuffers['move'] || {};
    var buffer = scope.networkBuffers['move'].buffer || new ArrayBuffer( 14 );
    var bufferView = scope.networkBuffers['move'].bufferView || new Int16Array( buffer );
    scope.networkBuffers['move'].buffer = buffer;
    scope.networkBuffers['move'].bufferView = bufferView;

    if ( scope.status !== Player.Alive ) {

        return;

    }

    scope.moveDirection.x = directionX;
    scope.moveDirection.y = directionZ;

    bufferView[ 1 ] = scope.id;
    bufferView[ 2 ] = directionX;
    bufferView[ 3 ] = directionZ;
    bufferView[ 4 ] = scope.position.x;
    bufferView[ 5 ] = scope.position.z;
    bufferView[ 6 ] = scope.rotation * 1000;

    scope.sendEventToPlayersInRange( 'PlayerTankMove', buffer, bufferView );

};

Player.prototype.shoot = function () {

    var scope = this;

    scope.networkBuffers['shoot'] = scope.networkBuffers['shoot'] || {};
    var buffer = scope.networkBuffers['shoot'].buffer || new ArrayBuffer( 14 );
    var bufferView = scope.networkBuffers['shoot'].bufferView || new Uint16Array( buffer );
    scope.networkBuffers['shoot'].buffer = buffer;
    scope.networkBuffers['shoot'].bufferView = bufferView;

    if ( scope.status !== Player.Alive ) {

        return;

    }

    if ( scope.shootTimeout ) return;

    scope.shootTimeout = setTimeout( function () {

        scope.shootTimeout = false;

    }, scope.tank.reloadTime );

    if ( scope.ammo <= 0 ) {

        return;

    }

    //

    var bullet = this.getInactiveBullet();
    if ( ! bullet ) return;
    bullet.activate( scope.position, scope.rotationTop );

    scope.ammo --;

    //

    bufferView[ 1 ] = scope.id;
    bufferView[ 2 ] = Player.numShootId;
    bufferView[ 3 ] = scope.ammo;

    Player.numShootId = ( Player.numShootId > 1000 ) ? 0 : Player.numShootId + 1;

    scope.sendEventToPlayersInRange( 'PlayerTankShoot', buffer, bufferView );

};

Player.prototype.hit = function ( killer ) {

    var scope = this;

    scope.networkBuffers['hit'] = scope.networkBuffers['hit'] || {};
    var buffer = scope.networkBuffers['hit'].buffer || new ArrayBuffer( 6 );
    var bufferView = scope.networkBuffers['hit'].bufferView || new Uint16Array( buffer );
    scope.networkBuffers['hit'].buffer = buffer;
    scope.networkBuffers['hit'].bufferView = bufferView;

    //

    if ( scope.status !== Player.Alive ) {

        return;

    }

    killer = scope.arena.playerManager.getById( killer ) || scope.arena.towerManager.getById( killer );

    if ( ! killer ) return;
    if ( killer.team.id === scope.team.id ) return;

    if ( killer ) {

        if ( killer instanceof Game.Player ) {

            scope.health -= 40 * ( killer.tank.bullet / scope.tank.armour ) * ( 0.5 * Math.random() + 0.5 );
            scope.health = Math.max( Math.round( scope.health ), 0 );

        } else if ( killer instanceof Game.Tower ) {

            scope.health -= 60 * ( killer.bullet / scope.tank.armour ) * ( 0.5 * Math.random() + 0.5 );
            scope.health = Math.max( Math.round( scope.health ), 0 );

        }

    }

    bufferView[ 1 ] = scope.id;
    bufferView[ 2 ] = scope.health;

    scope.sendEventToPlayersInRange( 'PlayerTankHit', buffer, bufferView );

    if ( scope.health <= 0 ) {

        scope.die( killer );

    }

};

Player.prototype.die = function ( killer ) {

    var scope = this;

    scope.networkBuffers['die'] = scope.networkBuffers['die'] || {};
    var buffer = scope.networkBuffers['die'].buffer || new ArrayBuffer( 8 );
    var bufferView = scope.networkBuffers['die'].bufferView || new Uint16Array( buffer );
    scope.networkBuffers['die'].buffer = buffer;
    scope.networkBuffers['die'].bufferView = bufferView;

    //

    if ( scope.status === Player.Dead ) return;

    scope.status = Player.Dead;

    killer.kills ++;
    scope.death ++;

    killer.team.kills ++;
    scope.team.death ++;

    scope.moveDirection.x = 0;
    scope.moveDirection.y = 0;

    bufferView[ 1 ] = scope.id;
    bufferView[ 2 ] = killer.id;
    bufferView[ 3 ] = killer.kills;

    scope.sendEventToPlayersInRange( 'PlayerTankDied', buffer, bufferView );

    //

    if ( scope.bot ) { // tmp hack for bot respown

        var maxKills = Math.floor( Math.random() * ( 200 - 100 ) ) + 100;

        if ( scope.arena.playerManager.players.length - scope.arena.botManager.bots.length < 5 && scope.kills < maxKills ) {

            setTimeout( scope.respawn.bind( scope ), 3000 );

        } else {

            setTimeout( function () {

                scope.arena.botManager.remove( scope );
                scope.arena.removePlayer( scope );

            }, 2000 );

        }

    } else if ( ! scope.socket ) {

        scope.arena.removePlayer( scope );

    }

    //

    setTimeout( function () {

        scope.arena.updateLeaderboard();

    }, 1000 );

};

Player.prototype.update = function ( delta, time ) {

    var scope = this;

    // check new towers in range

    var newTowersInRange = [];
    var towersOutOfRange = [];

    for ( var i = 0, il = scope.arena.towerManager.towers.length; i < il; i ++ ) {

        var tower = scope.arena.towerManager.towers[ i ];

        if ( scope.isObjectInRange( tower ) ) {

            if ( scope.inRangeOf[ 't-' + tower.id ] ) continue;

            scope.inRangeOf[ 't-' + tower.id ] = tower;
            tower.inRangeOf[ 'p-' + scope.id ] = scope;
            newTowersInRange.push( tower.toJSON() );

        } else {

            if ( scope.inRangeOf[ 't-' + tower.id ] ) {

                towersOutOfRange.push( tower.toJSON() );

            }

            scope.inRangeOf[ 't-' + tower.id ] = false;
            tower.inRangeOf[ 'p-' + scope.id ] = false;

        }

    }

    if ( this.socket ) {

        if ( newTowersInRange.length ) {

            networkManager.send( 'TowersInRange', scope.socket, false, newTowersInRange );

        }

        if ( towersOutOfRange.length ) {

            networkManager.send( 'TowersOutOfRange', scope.socket, false, towersOutOfRange );

        }

    }

    // check new players in range

    var newPlayersInRange = [];
    var playersOutOfRange = [];

    for ( var i = 0, il = scope.arena.playerManager.players.length; i < il; i ++ ) {

        var player = scope.arena.playerManager.players[ i ];

        if ( scope.id === player.id ) continue;

        if ( scope.isObjectInRange( player ) ) {

            if ( scope.inRangeOf[ 'p-' + player.id ] ) continue;

            scope.inRangeOf[ 'p-' + player.id ] = player;
            newPlayersInRange.push( player.toPublicJSON() );

        } else {

            if ( scope.inRangeOf[ 'p-' + player.id ] ) {

                playersOutOfRange.push( player.toPublicJSON() );

            }

            scope.inRangeOf[ 'p-' + player.id ] = false;

        }

    }

    if ( this.socket ) {

        if ( newPlayersInRange.length ) {

            networkManager.send( 'PlayersInRange', scope.socket, false, newPlayersInRange );

        }

        if ( playersOutOfRange.length ) {

            networkManager.send( 'PlayersOutOfRange', scope.socket, false, playersOutOfRange );

        }

    }

    // update player AWSD movement

    if ( scope.moveDirection.x !== 0 || scope.moveDirection.y !== 0 ) {

        if ( scope.moveDirection.x > 0 ) {

            scope.deltaPosition.x = + scope.moveSpeed * Math.sin( scope.rotation ) * delta;
            scope.deltaPosition.z = + scope.moveSpeed * Math.cos( scope.rotation ) * delta;

        } else if ( scope.moveDirection.x < 0 ) {

            scope.deltaPosition.x = - scope.moveSpeed * Math.sin( scope.rotation ) * delta;
            scope.deltaPosition.z = - scope.moveSpeed * Math.cos( scope.rotation ) * delta;

        }

        //

        if ( scope.moveDirection.y > 0 ) {

            scope.rotation += 0.001 * delta;

        } else if ( scope.moveDirection.y < 0 ) {

            scope.rotation -= 0.001 * delta;

        }

    }

};

Player.prototype.sendChatMessage = function ( data ) {

    var login = data.login;
    var message = data.message;
    var teamId = this.team.id;

    this.arena.announce( 'SendChatMessage', null, { login: login, message: message, teamId: teamId } );

};

Player.prototype.dispose = function () {

    this.arena.collisionManager.removeObject( this );

    for ( var i = 0, il = this.bulletsPool.length; i < il; i ++ ) {

        this.bulletsPool[ i ].dispose();

    }

};

Player.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'ArenaPlayerRespawn', function ( event ) { scope.respawn( event.data ); });
    this.addEventListener( 'PlayerTankRotateTop', function ( event ) { scope.rotateTop( event.data[0] / 1000 ); });
    this.addEventListener( 'PlayerTankMove', function ( event ) { scope.move( event.data[0], event.data[1] ); });
    this.addEventListener( 'PlayerTankMoveByPath', function ( event ) { scope.moveToPoint({ x: event.data[0], z: event.data[1] }); });
    this.addEventListener( 'PlayerTankShoot', function ( event ) { scope.shoot(); });

    this.addEventListener( 'SendChatMessage', function ( event ) { scope.sendChatMessage( event.data ) });

};

Player.prototype.isObjectInRange = function ( object ) {

    var scope = this;
    var distance = Math.sqrt( Math.pow( scope.position.x - object.position.x, 2 ) + Math.pow( scope.position.z - object.position.z, 2 ) );

    return ( distance < scope.viewRange );

};

Player.prototype.sendEventToPlayersInRange = function ( event, buffer, bufferView ) {

    var scope = this;

    //

    if ( scope.socket ) {

        networkManager.send( event, scope.socket, buffer, bufferView );

    }

    for ( var i in scope.inRangeOf ) {

        if ( i[0] === 'p' ) {

            var player = scope.inRangeOf[ i ];
            if ( ! player || ! player.socket ) continue;
            networkManager.send( event, player.socket, buffer, bufferView );

        }

    }

};

Player.prototype.toPrivateJSON = function () {

    return {

        id:             this.id,
        login:          this.login,
        team:           this.team.id,
        tank:           this.tank.title,
        tank:           this.tank.title,
        health:         this.health,
        ammo:           this.ammo,
        rotation:       this.rotation,
        rotationTop:    this.rotationTop,
        position:       this.position,

    };

};

Player.prototype.toPublicJSON = function () {

    return {

        id:             this.id,
        login:          this.login,
        team:           this.team.id,
        tank:           this.tank.title,
        health:         this.health,
        rotation:       this.rotation,
        rotationTop:    this.rotationTop,
        position:       this.position

    };

};

Player.numIds = 1;
Player.numShootId = 0;
Player.Alive = 100;
Player.Dead = 110;
Player.AFK = 120;

//

module.exports = Player;
