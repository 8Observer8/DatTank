/*
 * @author ohmed
 * Tower object class
*/

var Tower = function ( arena, params ) {

    Game.EventDispatcher.call( this );

    if ( Tower.numIds > 2000 ) Tower.numIds = 1000;
    this.id = Tower.numIds ++;

    this.arena = arena;
    this.team = params.team || false;
    this.health = 100;
    this.shootTime = Date.now();
    this.cooldown = 1300;
    this.target = false;

    this.bulletsPool = [];

    this.rotation = 0;
    this.newRotation = 0;
    this.position = {
        x: params.position.x || 0,
        y: params.position.y || 0,
        z: params.position.z || 0
    };

    this.range = 300;
    this.armour = 350;
    this.bullet = 150;
    this.sinceHitRegeneraionLimit = 5000;
    this.sinceHitTime = false;
    this.sinceRegenerationLimit = 2000;
    this.sinceRegenerationTime = false;

    this.networkBuffers = {};
    this.inRangeOf = {};

    this.collisionBox = false;

    //

    var teams = arena.teamManager.teams;

    for ( var i in teams ) {

        if ( teams[ i ].id >= 1000 ) continue;

        if ( utils.getDistance( teams[ i ].spawnPosition, this.position ) < 50 ) {

            this.team = teams[ i ];
            break;

        }

    }

    this.type = 'Tower';

    //

    this.init();

};

Tower.prototype = Object.create( Game.EventDispatcher.prototype );

//

Tower.prototype.init = function () {

    this.sizeX = 35;
    this.sizeY = 35;
    this.sizeZ = 35;

    this.arena.collisionManager.addObject( this, 'box' );

    this.initBulletPool();
    this.addEventListeners();

};

Tower.prototype.initBulletPool = function () {

    for ( var i = 0; i < 10; i ++ ) {

        this.bulletsPool.push( new Game.Bullet( this.arena, this.id ) );

    }

};

Tower.prototype.getInactiveBullet = function () {

    for ( var i = 0; i < this.bulletsPool.length; i ++ ) {

        if ( ! this.bulletsPool[ i ].active ) {

            return this.bulletsPool[ i ];

        }

    }

    return false;

};

Tower.prototype.updateHealth = function ( delta ) {

    this.networkBuffers['UpdateHealth'] = this.networkBuffers['UpdateHealth'] || {};
    var buffer = this.networkBuffers['UpdateHealth'].buffer || new ArrayBuffer( 6 );
    var bufferView = this.networkBuffers['UpdateHealth'].bufferView || new Uint16Array( buffer );
    this.networkBuffers['UpdateHealth'].buffer = buffer;
    this.networkBuffers['UpdateHealth'].bufferView = bufferView;

    //

    var health = Math.max( Math.min( this.health - delta, 100 ), 0 );
    if ( health === this.health ) return;
    this.health = health;

    //

    bufferView[ 1 ] = this.id;
    bufferView[ 2 ] = this.health;

    this.sendEventToPlayersInRange( 'TowerUpdateHealth', buffer, bufferView );

};

Tower.prototype.shoot = function ( target ) {

    var scope = this;

    scope.networkBuffers['shoot'] = scope.networkBuffers['shoot'] || {};
    var buffer = scope.networkBuffers['shoot'].buffer || new ArrayBuffer( 6 );
    var bufferView = scope.networkBuffers['shoot'].bufferView || new Uint16Array( buffer );
    scope.networkBuffers['shoot'].buffer = buffer;
    scope.networkBuffers['shoot'].bufferView = bufferView;

    //

    var dx = target.position.x - scope.position.x;
    var dz = target.position.z - scope.position.z;
    var rotation, delta;

    if ( dz === 0 && dx !== 0 ) {

        rotation = ( dx > 0 ) ? - Math.PI : 0;

    } else {

        rotation = - Math.PI / 2 - Math.atan2( dz, dx );

    }

    delta = utils.formatAngle( rotation ) - utils.formatAngle( scope.rotation );

    if ( Math.abs( delta ) > 0.5 ) return;

    //

    if ( Date.now() - scope.shootTime < scope.cooldown ) {

        return;

    }

    scope.shootTime = Date.now();

    //

    var bullet = this.getInactiveBullet();
    if ( ! bullet ) return;
    bullet.activate( this.position, this.rotation + Math.PI );

    //

    bufferView[1] = scope.id;
    bufferView[2] = bullet.id;

    scope.sendEventToPlayersInRange( 'TowerShoot', buffer, bufferView );

};

Tower.prototype.hit = function ( killer ) {

    killer = this.arena.playerManager.getById( killer );

    if ( ! killer ) return;
    if ( killer.team.id === this.team.id ) {

        killer.friendlyFire();
        return;

    }

    //

    this.sinceHitTime = 0;
    this.sinceRegenerationTime = 0;

    this.updateHealth( Math.floor( 57 * ( killer.tank.bullet / this.armour ) * ( 0.5 * Math.random() + 0.5 ) ) );

    //

    if ( this.health === 0 ) {

        this.changeTeam( killer.team, killer.id );
        return;

    }

};

Tower.prototype.changeTeam = function ( team, killerId ) {

    var scope = this;

    scope.networkBuffers['changeTeam'] = scope.networkBuffers['changeTeam'] || {};
    var buffer = scope.networkBuffers['changeTeam'].buffer || new ArrayBuffer( 8 );
    var bufferView = scope.networkBuffers['changeTeam'].bufferView || new Uint16Array( buffer );
    scope.networkBuffers['changeTeam'].buffer = buffer;
    scope.networkBuffers['changeTeam'].bufferView = bufferView;

    //

    team.towers ++;
    scope.team.towers --;

    //

    scope.team = team;
    scope.health = 100;

    //

    bufferView[ 1 ] = scope.id;
    bufferView[ 2 ] = team.id;
    bufferView[ 3 ] = killerId;

    //

    scope.arena.updateLeaderboard();

    //

    scope.sendEventToPlayersInRange( 'TowerChangeTeam', buffer, bufferView );

};

Tower.prototype.checkForTarget = function ( players ) {

    var dist;
    var target = false;
    var minDistance = 300;

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        if ( players[ i ].team.id === this.team.id || players[ i ].status !== Game.Player.Alive ) {

            continue;

        }

        //

        dist = utils.getDistance( this.position, players[ i ].position );

        if ( dist > this.range ) continue;

        if ( dist < minDistance ) {

            minDistance = dist;
            target = players[ i ];

        }

    }

    //

    return target;

};

Tower.prototype.rotateTop = function ( target, delta ) {

    var scope = this;

    scope.networkBuffers['rotateTop'] = scope.networkBuffers['rotateTop'] || {};
    var buffer = scope.networkBuffers['rotateTop'].buffer || new ArrayBuffer( 8 );
    var bufferView = scope.networkBuffers['rotateTop'].bufferView || new Uint16Array( buffer );
    scope.networkBuffers['rotateTop'].buffer = buffer;
    scope.networkBuffers['rotateTop'].bufferView = bufferView;

    //

    var dx = target.position.x - scope.position.x;
    var dz = target.position.z - scope.position.z;
    var newRotation, deltaRot;

    if ( dz === 0 && dx !== 0 ) {

        newRotation = ( dx > 0 ) ? - Math.PI : 0;

    } else {

        newRotation = - Math.PI / 2 - Math.atan2( dz, dx );

    }

    newRotation = utils.formatAngle( newRotation );

    //

    deltaRot = scope.newRotation - scope.rotation;

    if ( deltaRot > Math.PI ) {

        if ( delta > 0 ) {

            deltaRot = - 2 * Math.PI + deltaRot;

        } else {

            deltaRot = 2 * Math.PI + deltaRot;

        }

    }

    if ( Math.abs( deltaRot ) > 0.01 ) {

        scope.rotation = utils.formatAngle( scope.rotation + Math.sign( deltaRot ) / 30 * ( delta / 50 ) );

    }

    //

    if ( Math.abs( newRotation - scope.newRotation ) > 0.15 ) {

        scope.newRotation = newRotation;

        bufferView[1] = scope.id;
        bufferView[2] = Math.floor( 1000 * scope.rotation );
        bufferView[3] = Math.floor( 1000 * scope.newRotation );

        scope.sendEventToPlayersInRange( 'TowerRotateTop', buffer, bufferView );

    }

    //

    if ( Date.now() - scope.shootTime > scope.cooldown && deltaRot < 0.5 ) {

        scope.shoot( target );

    }

};

Tower.prototype.update = function ( delta, time ) {

    var target = false;

    //

    target = target || this.checkForTarget( this.arena.playerManager.players );

    if ( ! target ) {

        this.target = false;

    } else {

        this.target = target;
        this.rotateTop( target, delta );

    }

    //

    this.sinceHitTime += delta;
    if ( this.sinceHitTime > this.sinceHitRegeneraionLimit ) {

        if ( this.sinceRegenerationTime > this.sinceRegenerationLimit ) {

            this.updateHealth( - 5 );
            this.sinceRegenerationTime = 0;

        } else {

            this.sinceRegenerationTime += delta;

        }

    }

};

Tower.prototype.toJSON = function () {

    return {

        id:         this.id,
        team:       this.team.id,
        health:     this.health,
        position:   { x: this.position.x, y: this.position.y, z: this.position.z },
        rotation:   this.rotation

    };

};

Tower.prototype.addEventListeners = function () {

    // nothing here

};

Tower.prototype.sendEventToPlayersInRange = function ( event, buffer, bufferView ) {

    var scope = this;

    //

    for ( var i in scope.inRangeOf ) {

        if ( i[0] === 'p' ) {

            var player = scope.inRangeOf[ i ];
            if ( ! player.socket ) continue;
            networkManager.send( event, player.socket, buffer, bufferView );

        }

    }

};

//

Tower.numIds = 1000;
Tower.Alive = 100;
Tower.Dead = 101;

//

module.exports = Tower;
