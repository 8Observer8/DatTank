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
    this.hits = {};

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
    this.bullet = 100;

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

    //

    this.init();

};

Tower.prototype = Object.create( Game.EventDispatcher.prototype );

//

Tower.prototype.init = function () {

    var position = this.position;
    this.sizeX = 35;
    this.sizeY = 35;
    this.sizeZ = 35;
    var id = this.id;

    this.arena.pathManager.placeObject( new Game.Vec3( position.x - this.sizeX / 2, 0, position.z - this.sizeZ / 2 ), new Game.Vec3( position.x + this.sizeX / 2, 0, position.z + this.sizeZ / 2 ) );
    this.arena.collisionManager.addObject( this, 'box' );

    this.initBulletPool();
    this.addEventListeners();

};

Tower.prototype.initBulletPool = function () {

    for ( var i = 0; i < 10; i ++ ) {

        this.bulletsPool.push({
            active:         false,
            origPosition:   { x: 0, y: 25, z: 0 },
            position:       { x: 0, y: 25, z: 0 },
            angle:          false,
            id:             false,
            ownerId:        this.id,
            flytime:        5
        });

    }

};

Tower.prototype.getInactiveBullet = function () {

    for ( var i = 0; i < this.bulletsPool.length; i ++ ) {

        if ( ! this.bulletsPool[ i ].active ) {

            return this.bulletsPool[ i ];

        }

    }

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
    bullet.active = true;
    bullet.origPosition.x = scope.position.x;
    bullet.origPosition.y = 25;
    bullet.origPosition.z = scope.position.z;
    bullet.position.x = scope.position.x;
    bullet.position.y = 25;
    bullet.position.z = scope.position.z;
    bullet.angle = scope.rotation + Math.PI / 2;
    bullet.flytime = 5;
    bullet.id = Tower.numShootId;

    //

    bufferView[1] = scope.id;
    bufferView[2] = Tower.numShootId;

    Tower.numShootId = ( Tower.numShootId > 1000 ) ? 0 : Tower.numShootId + 1;

    scope.sendEventToPlayersInRange( 'TowerShoot', buffer, bufferView );

};

Tower.prototype.hit = function ( killer, shootId ) {

    var scope = this;

    scope.networkBuffers['hit'] = scope.networkBuffers['hit'] || {};
    var buffer = scope.networkBuffers['hit'].buffer || new ArrayBuffer( 6 );
    var bufferView = scope.networkBuffers['hit'].bufferView || new Uint16Array( buffer );
    scope.networkBuffers['hit'].buffer = buffer;
    scope.networkBuffers['hit'].bufferView = bufferView;

    //

    killer = scope.arena.playerManager.getById( killer );

    if ( ! killer ) return;
    if ( killer.team.id === scope.team.id ) return;

    var amount = Math.floor( 57 * ( killer.tank.bullet / scope.armour ) * ( 0.5 * Math.random() + 0.5 ) );

    if ( scope.health - amount <= 0 ) {

        scope.health = 0;
        scope.changeTeam( killer.team );

        return;

    }

    //

    scope.health -= amount;

    bufferView[ 1 ] = scope.id;
    bufferView[ 2 ] = scope.health;

    scope.sendEventToPlayersInRange( 'TowerHit', buffer, bufferView );

};

Tower.prototype.changeTeam = function ( team ) {

    var scope = this;

    scope.networkBuffers['changeTeam'] = scope.networkBuffers['changeTeam'] || {};
    var buffer = scope.networkBuffers['changeTeam'].buffer || new ArrayBuffer( 6 );
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

Tower.prototype.update = function ( delta ) {

    var target = false;

    // update tower shoted bullets

    for ( var i = 0, il = this.bulletsPool.length; i < il; i ++ ) {

        var bullet = this.bulletsPool[ i ];
        if ( ! bullet.active ) continue;
        bullet.flytime --;

        if ( bullet.flytime < 0 ) {

            bullet.active = false;
            continue;

        }

        var bulletCollisionResult = this.arena.collisionManager.moveBullet( bullet, delta );

        if ( bulletCollisionResult ) {

            bullet.active = false;

            this.sendEventToPlayersInRange( 'BulletHit', null, { bulletId: bullet.id, position: bullet.position } );

            var killer = this.id;
            target = this.arena.playerManager.getById( bulletCollisionResult.id );

            if ( target && target.hit ) {

                target.hit( killer );

            }

        }

    }

    //

    target = target || this.checkForTarget( this.arena.playerManager.players );

    if ( ! target ) {

        this.target = false;
        return;

    }

    this.target = target;

    //

    this.rotateTop( target, delta );

};

Tower.prototype.toJSON = function () {

    return {

        id:         this.id,
        team:       this.team.id,
        health:     this.health,
        position:   { x: this.position.x, y: this.position.y, z: this.position.z }

    };

};

Tower.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'TowerHit', function ( event ) { scope.hit( event.data[1], event.data[2] ); });

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
Tower.numShootId = 0;
Tower.Alive = 100;
Tower.Dead = 101;

//

module.exports = Tower;
