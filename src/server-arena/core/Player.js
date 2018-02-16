/*
 * @author ohmed
 * DatTank Player object
*/

var Player = function ( arena, params ) {

    params = params || {};

    Game.EventDispatcher.call( this );

    if ( Player.numIds > 1000 ) Player.numIds = 0;

    this.id = Player.numIds ++;
    this.arena = arena || false;
    this.login = params.login || false;

    //

    var loginAttempt = 1;

    while ( ! this.login ) {

        this.login = 'player ' + loginAttempt;

        for ( var i = 0, il = this.arena.playerManager.players.length; i < il; i ++ ) {

            if ( this.arena.playerManager.players[ i ].login === this.login ) {

                this.login = false;
                loginAttempt ++;
                break;

            }

        }

    }

    //

    this.moveDirection = new Game.Vec2();
    this.moveSpeed = 0.09;
    this.originalMoveSpead = this.moveSpeed;

    this.sinceHitRegeneraionLimit = 5000;
    this.sinceHitTime = false;
    this.sinceRegenerationLimit = 2000;
    this.sinceRegenerationTime = false;

    this.status = Player.Alive;

    this.socket = params.socket || false;

    if ( this.socket ) {

        this.socket.player = this;
        this.socket.arena = arena;

    }

    this.sizeX = 40;
    this.sizeZ = 50;

    this.bulletsPool = [];

    this.team = false;
    this.health = 100;
    this.kills = 0;
    this.death = 0;

    this.collisionBox = false;

    this.shootTimeout = false;

    this.position = new Game.Vec3();
    this.deltaPosition = new Game.Vec3();
    this.rotation = 0;
    this.rotationTop = - Math.PI / 2;

    this.networkBuffers = {};
    this.inRangeOf = {};
    this.viewRange = 600;

    //

    this.selectTank( params.tank );
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

    tankName = tankName || ( this.tank ) ? this.tank.title.replace( '-', '' ) : 'USA-T54';

    var newPosition = new Game.Vec3( this.team.spawnPosition.x, this.team.spawnPosition.y, this.team.spawnPosition.z );

    var offsetX = 0;
    var offsetZ = 0;

    while ( Math.sqrt( offsetX * offsetX + offsetZ * offsetZ ) < 80 || ! this.arena.collisionManager.isPlaceFree( { x: newPosition.x + offsetX, y: newPosition.z + offsetZ }, 50, 0 ) ) {

        offsetX = ( Math.random() - 0.5 ) * 250;
        offsetZ = ( Math.random() - 0.5 ) * 250;

    }

    newPosition.x += offsetX;
    newPosition.z += offsetZ;

    //

    this.status = Player.Alive;
    this.health = 100;
    this.ammo = this.tank.maxShells;
    this.position.set( newPosition.x, newPosition.y, newPosition.z );
    this.rotation = 0;
    this.rotationTop = 0;
    var playerJSON = this.toPrivateJSON();
    this.position = newPosition;

    this.sendEventToPlayersInRange( 'ArenaPlayerRespawn', false, { player: playerJSON } );

    //

    this.selectTank( tankName );
    this.arena.updateLeaderboard();

    if ( ! this.collisionBox ) {

        this.arena.collisionManager.addObject( this, 'box', true );

    } else {

        this.collisionBox.body.position[0] = this.position.x;
        this.collisionBox.body.position[1] = this.position.z;

    }

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

};

Player.prototype.changeHealth = function ( delta, killer ) {

    if ( this.status !== Player.Alive ) {

        return;

    }

    //

    var health = this.health + delta;
    health = Math.max( Math.min( 100, health ), 0 );
    if ( this.health === health ) return;
    this.health = health;

    //

    this.networkBuffers['UpdateHealth'] = this.networkBuffers['UpdateHealth'] || {};
    var buffer = this.networkBuffers['UpdateHealth'].buffer || new ArrayBuffer( 8 );
    var bufferView = this.networkBuffers['UpdateHealth'].bufferView || new Int16Array( buffer );
    this.networkBuffers['UpdateHealth'].buffer = buffer;
    this.networkBuffers['UpdateHealth'].bufferView = bufferView;

    bufferView[ 1 ] = this.id;
    bufferView[ 2 ] = this.health;
    bufferView[ 3 ] = ( killer ) ? killer.id : -1;

    //

    this.sendEventToPlayersInRange( 'PlayerTankUpdateHealth', buffer, bufferView );

    //

    if ( this.health === 0 ) {

        this.die( killer );

        if ( killer.type === 'Player' ) {
        
            game.updateTopList( killer.login, killer.kills );

        }

    }

};

Player.prototype.changeAmmo = function ( delta ) {

    if ( this.status !== Player.Alive ) {

        return;

    }

    //

    this.ammo += delta;
    this.ammo = Math.max( Math.min( this.tank.maxShells, this.ammo ), 0 );

    //

    this.networkBuffers['UpdateAmmo'] = this.networkBuffers['UpdateAmmo'] || {};
    var buffer = this.networkBuffers['UpdateAmmo'].buffer || new ArrayBuffer( 6 );
    var bufferView = this.networkBuffers['UpdateAmmo'].bufferView || new Int16Array( buffer );
    this.networkBuffers['UpdateAmmo'].buffer = buffer;
    this.networkBuffers['UpdateAmmo'].bufferView = bufferView;

    bufferView[ 1 ] = this.id;
    bufferView[ 2 ] = this.ammo;

    //

    if ( this.socket ) {

        networkManager.send( 'PlayerTankUpdateAmmo', this.socket, buffer, bufferView );

    }

};

Player.prototype.move = function ( directionX, directionZ ) {

    var scope = this;

    if ( scope.moveDirection.x === directionX && scope.moveDirection.y === directionZ ) {

        return;

    }

    //

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

    //

    scope.sendEventToPlayersInRange( 'PlayerTankMove', buffer, bufferView );

};

Player.prototype.shoot = function () {

    var scope = this;

    scope.networkBuffers['shoot'] = scope.networkBuffers['shoot'] || {};
    var buffer = scope.networkBuffers['shoot'].buffer || new ArrayBuffer( 6 );
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

    bullet.activate( scope.position, scope.rotationTop + scope.rotation + Math.PI / 2 );

    scope.ammo --;

    //

    bufferView[ 1 ] = scope.id;
    bufferView[ 2 ] = bullet.id;

    scope.sendEventToPlayersInRange( 'PlayerTankShoot', buffer, bufferView );

};

Player.prototype.friendlyFire = function () {

    if ( ! this.socket ) return;

    this.networkBuffers['FriendlyFire'] = this.networkBuffers['FriendlyFire'] || {};
    var buffer = this.networkBuffers['FriendlyFire'].buffer || new ArrayBuffer( 4 );
    var bufferView = this.networkBuffers['FriendlyFire'].bufferView || new Uint16Array( buffer );
    this.networkBuffers['FriendlyFire'].buffer = buffer;
    this.networkBuffers['FriendlyFire'].bufferView = bufferView;

    bufferView[1] = this.id;

    networkManager.send( 'PlayerFriendlyFire', this.socket, buffer, bufferView );

};

Player.prototype.hit = function ( killer ) {

    if ( this.status !== Player.Alive ) {

        return;

    }

    //

    killer = this.arena.playerManager.getById( killer ) || this.arena.towerManager.getById( killer );

    if ( ! killer ) return;
    if ( killer.team.id === this.team.id ) {

        if ( killer instanceof Player ) killer.friendlyFire();
        return;

    }

    this.sinceHitTime = 0;
    this.sinceRegenerationTime = 0;

    //

    var bulletSize = ( killer.tank ) ? killer.tank.bullet : killer.bullet;
    this.changeHealth( - 40 * ( bulletSize / this.tank.armour ) * ( 0.5 * Math.random() + 0.5 ), killer );

};

Player.prototype.die = function ( killer ) {

    if ( this.status === Player.Dead ) return;

    this.status = Player.Dead;

    killer.kills ++;
    this.death ++;

    killer.team.kills ++;
    this.team.death ++;

    this.moveDirection.x = 0;
    this.moveDirection.y = 0;

    //

    if ( this.bot ) {

        this.bot.die();

    } else if ( ! this.socket ) {

        this.arena.removePlayer( this );

    }

    //

    this.arena.updateLeaderboard();

};

Player.prototype.isObjectInRange = function ( object ) {

    var distance = Math.sqrt( Math.pow( this.position.x - object.position.x, 2 ) + Math.pow( this.position.z - object.position.z, 2 ) );
    return ( distance < this.viewRange );

};

//

Player.prototype.update = function ( delta, time ) {

    var scope = this;

    // regeneration

    this.sinceHitTime += delta;
    if ( this.sinceHitTime > this.sinceHitRegeneraionLimit ) {

        if ( this.sinceRegenerationTime > this.sinceRegenerationLimit ) {

            this.changeHealth( 2 );
            this.sinceRegenerationTime = 0;

        } else {

            this.sinceRegenerationTime += delta;

        }

    }

    // check boxes in range

    var newBoxesInRange = [];

    for ( var i = 0, il = scope.arena.boxManager.boxes.length; i < il; i ++ ) {

        var box = scope.arena.boxManager.boxes[ i ];

        if ( scope.isObjectInRange( box ) ) {

            if ( scope.inRangeOf[ 'b-' + box.id ] ) continue;

            scope.inRangeOf[ 'b-' + box.id ] = box;
            newBoxesInRange.push( box.toJSON() );

        } else {

            delete scope.inRangeOf[ 'b-' + box.id ];

        }

    }

    if ( this.socket && newBoxesInRange.length ) {

        networkManager.send( 'BoxesInRange', scope.socket, false, newBoxesInRange );

    }

    // check towers in range

    var newTowersInRange = [];

    for ( var i = 0, il = scope.arena.towerManager.towers.length; i < il; i ++ ) {

        var tower = scope.arena.towerManager.towers[ i ];

        if ( scope.isObjectInRange( tower ) ) {

            if ( scope.inRangeOf[ 't-' + tower.id ] ) continue;

            scope.inRangeOf[ 't-' + tower.id ] = tower;
            tower.inRangeOf[ 'p-' + scope.id ] = scope;
            newTowersInRange.push( tower.toJSON() );

        } else {

            delete scope.inRangeOf[ 't-' + tower.id ];
            delete tower.inRangeOf[ 'p-' + scope.id ];

        }

    }

    if ( this.socket && newTowersInRange.length ) {

        networkManager.send( 'TowersInRange', scope.socket, false, newTowersInRange );

    }

    // check players in range

    var newPlayersInRange = [];

    for ( var i = 0, il = scope.arena.playerManager.players.length; i < il; i ++ ) {

        var player = scope.arena.playerManager.players[ i ];

        if ( scope.id === player.id ) continue;

        if ( scope.isObjectInRange( player ) ) {

            if ( scope.inRangeOf[ 'p-' + player.id ] ) continue;

            scope.inRangeOf[ 'p-' + player.id ] = player;
            newPlayersInRange.push( player.toPublicJSON() );

        } else {

            delete scope.inRangeOf[ 'p-' + player.id ];

        }

    }

    if ( this.socket && newPlayersInRange.length ) {

        networkManager.send( 'PlayersInRange', scope.socket, false, newPlayersInRange );

    }

    // update player AWSD movement

    if ( scope.moveDirection.x !== 0 || scope.moveDirection.y !== 0 ) {

        if ( scope.moveDirection.x > 0 ) {

            scope.deltaPosition.x = + scope.moveSpeed * Math.sin( scope.rotation ) * delta;
            scope.deltaPosition.z = + scope.moveSpeed * Math.cos( scope.rotation ) * delta;

        } else if ( scope.moveDirection.x < 0 ) {

            scope.deltaPosition.x = - scope.moveSpeed * Math.sin( scope.rotation ) * delta;
            scope.deltaPosition.z = - scope.moveSpeed * Math.cos( scope.rotation ) * delta;

        } else {

            scope.deltaPosition.x = 0;
            scope.deltaPosition.z = 0;

        }

        //

        if ( scope.moveDirection.y > 0 ) {

            scope.rotation += 0.001 * delta;

        } else if ( scope.moveDirection.y < 0 ) {

            scope.rotation -= 0.001 * delta;

        }

    }

    // if bot update

    if ( this.bot ) {

        this.bot.update();

    }

};

Player.prototype.dispose = function () {

    this.arena.collisionManager.removeObject( this );

};

Player.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'ArenaPlayerRespawn', function ( event ) { scope.respawn( event.data ); });
    this.addEventListener( 'PlayerTankRotateTop', function ( event ) { scope.rotateTop( event.data[0] / 1000 ); });
    this.addEventListener( 'PlayerTankMove', function ( event ) { scope.move( event.data[0], event.data[1] ); });
    this.addEventListener( 'PlayerTankShoot', function ( event ) { scope.shoot(); });

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
        health:         this.health,
        ammo:           this.ammo,
        rotation:       this.rotation,
        rotationTop:    this.rotationTop,
        position:       this.position,
        moveDirection:  { x: this.moveDirection.x, y: this.moveDirection.y }

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
        position:       this.position,
        moveDirection:  { x: this.moveDirection.x, y: this.moveDirection.y }

    };

};

Player.numIds = 1;
Player.Alive = 100;
Player.Dead = 110;
Player.AFK = 120;

//

module.exports = Player;