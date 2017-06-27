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

    this.sizeX = 25;
    this.sizeZ = 7;

    this.bullets = [];

    this.disable = false;

    this.arena = arena || false;
    this.team = false;
    this.health = 100;
    this.kills = 0;
    this.death = 0;

    this.afkTimeout = false;
    this.moveDelay = false;
    this.shootTimeout = false;

    this.pathFindIter = 0;
    this.movePath = false;
    this.movementDurationMap = false;
    this.movementDuration = 0;

    this.position = new Game.Vec3();
    this.rotation = 0;
    this.rotationTop = - Math.PI / 2;
    this.lastUpdatedTopRotation = - Math.PI / 2;

    this.selectTank( params.tank );

    this.networkBuffers = {};
    this.inRangeOf = {};
    this.viewRange = 700;

    //

    this.addEventListeners();

};

Player.prototype = Object.create( Game.EventDispatcher.prototype );

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

    this.selectTank( tankName );

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

Player.prototype.rotateBase = function ( direction ) {

    this.baseRotationDirection = direction;

};

Player.prototype.move = function ( directionX, directionZ ) {

    var scope = this;

    scope.networkBuffers['move'] = scope.networkBuffers['move'] || {};
    var buffer = scope.networkBuffers['move'].buffer || new ArrayBuffer( 14 );
    var bufferView = scope.networkBuffers['move'].bufferView || new Uint16Array( buffer );
    scope.networkBuffers['move'].buffer = buffer;
    scope.networkBuffers['move'].bufferView = bufferView;

    if ( scope.status !== Player.Alive ) {

        return;

    }

    scope.movePath = false;
    scope.movementDurationMap = false;
    scope.movementDuration = 0;

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

Player.prototype.moveToPoint = function ( destination, retry ) {

    if ( this.status !== Player.Alive ) return;

    var scope = this;

    if ( ! retry ) this.pathFindIter = 0;

    this.arena.pathManager.findPath( this.position, destination, function ( path ) {

        if ( scope.status !== Player.Alive ) return;

        if ( path.length === 0 ) {

            destination.x += 10;
            destination.z += 10;
            scope.pathFindIter ++;

            if ( scope.pathFindIter < 50 ) {

                scope.moveToPoint( destination, true );

            }

            return;

        }

        var buffer = new ArrayBuffer( 2 * 2 * path.length + ( 1 + 1 + 2 ) * 2 );
        var bufferView = new Int16Array( buffer );

        bufferView[1] = scope.id;

        var offset = 2;

        for ( var i = 0, il = path.length; i < il; i ++ ) {

            bufferView[ 2 * i + 0 + offset ] = path[ i ].x;
            bufferView[ 2 * i + 1 + offset ] = path[ i ].z;

        }

        bufferView[ bufferView.length - 2 ] = destination.x;
        bufferView[ bufferView.length - 1 ] = destination.z;

        scope.sendEventToPlayersInRange( 'PlayerTankMoveByPath', buffer, bufferView );

        //

        path = scope.arena.pathManager.deCompressPath( path );

        path.push( scope.position.x, scope.position.z );
        path.unshift( destination.x, destination.z );
        path.unshift( destination.x, destination.z );

        var minDistIndex = 0;

        for ( var i = path.length / 2 - 1; i > 0; i -- ) {

            if ( Math.sqrt( Math.pow( scope.position.x - path[ 2 * i + 0 ], 2 ) + Math.pow( scope.position.z - path[ 2 * i + 1 ], 2 ) ) < 3 ) {

                minDistIndex = i;

            }

        }

        for ( var i = minDistIndex; i < path.length / 2; i ++ ) {

            path.pop();
            path.pop();

        }

        //

        scope.processPath( path );

    });

};

Player.prototype.processPath = function ( path ) {

    var scope = this;

    this.movementStart = Date.now();
    this.movementDuration = 0;
    this.movementDurationMap = [];
    this.moveProgress = path.length / 2;

    var dx, dz;

    for ( var i = path.length / 2 - 1; i > 0; i -- ) {

        dx = path[ 2 * ( i - 1 ) + 0 ] - path[ 2 * i + 0 ];
        dz = path[ 2 * ( i - 1 ) + 1 ] - path[ 2 * i + 1 ];

        this.movementDurationMap.push( this.movementDuration );
        this.movementDuration += Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) / this.moveSpeed;

    }

    //

    clearTimeout( this.moveDelay );
    this.moveDelay = setTimeout( function () {

        scope.movePath = path;

    }, 20 );

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

    scope.bullets.push({
        origPosition:   { x: scope.position.x, y: 25, z: scope.position.z },
        position:       { x: scope.position.x, y: 25, z: scope.position.z },
        angle:          scope.rotationTop,
        id:             Player.numShootId,
        ownerId:        scope.id,
        flytime:        5
    });

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

            scope.health -= 40 * ( 50 / scope.tank.armour ) * ( 0.5 * Math.random() + 0.5 );
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

    scope.movePath = false;
    scope.moveProgress = false;
    scope.movementDurationMap = false;

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

};

Player.prototype.update = function ( delta, time ) {

    var scope = this;

    // check new towers in range

    var newTowersInRange = [];

    for ( var i = 0, il = scope.arena.towerManager.towers.length; i < il; i ++ ) {

        var tower = scope.arena.towerManager.towers[ i ];

        if ( scope.isObjectInRange( tower ) ) {

            if ( scope.inRangeOf[ 't-' + tower.id ] ) continue;

            scope.inRangeOf[ 't-' + tower.id ] = tower;
            tower.inRangeOf[ 'p-' + scope.id ] = scope;
            newTowersInRange.push( tower.toJSON() );

        } else {

            scope.inRangeOf[ 't-' + tower.id ] = false;
            tower.inRangeOf[ 'p-' + scope.id ] = false;

        }

    }

    if ( newTowersInRange.length ) {

        networkManager.send( 'TowersInRange', scope.socket, false, newTowersInRange );

    }

    // check new players in range

    var newPlayersInRange = [];

    for ( var i = 0, il = scope.arena.playerManager.players.length; i < il; i ++ ) {

        var player = scope.arena.playerManager.players[ i ];

        if ( scope.id === player.id ) continue;

        if ( scope.isObjectInRange( player ) ) {

            if ( scope.inRangeOf[ 'p-' + player.id ] ) continue;

            scope.inRangeOf[ 'p-' + player.id ] = player;
            newPlayersInRange.push( player.toPublicJSON() );

        } else {

            scope.inRangeOf[ 'p-' + player.id ] = false;

        }

    }

    if ( newPlayersInRange.length ) {

        networkManager.send( 'PlayersInRange', scope.socket, false, newPlayersInRange );

    }

    // compute bullet positions & collisions

    for ( var i = 0, il = scope.bullets.length; i < il; i ++ ) {

        scope.bullets[ i ].flytime --;

        if ( scope.bullets[ i ].flytime > 0 ) {

            var bulletCollisionResult = scope.arena.collisionManager.moveBullet( scope.bullets[ i ], delta );

            if ( bulletCollisionResult ) {

                var bullet = scope.bullets.splice( i, 1 )[ 0 ];
                i --;
                il --;

                scope.sendEventToPlayersInRange('BulletHit', null, { scope: { id: scope.id }, bulletId: bullet.id, position: bullet.position } );

                var killer = scope.id;
                var target = scope.arena.playerManager.getById( bulletCollisionResult.id ) || scope.arena.towerManager.getById( bulletCollisionResult.id );

                if ( target && target.hit ) {

                    target.hit( killer );

                }

            }

        }

    }

    // update player AWSD movement

    if ( scope.moveDirection.x !== 0 || scope.moveDirection.y !== 0 ) {

        if ( ! this.arena.collisionManager.moveTank( scope.moveDirection, scope, delta ) ) {

            if ( scope.moveDirection.x > 0 ) {

                scope.position.x -= ( scope.moveSpeed * Math.sin( scope.rotation ) * delta );
                scope.position.z -= ( scope.moveSpeed * Math.cos( scope.rotation ) * delta );

            } else if ( scope.moveDirection.x < 0 ) {

                scope.position.x += ( scope.moveSpeed * Math.sin( scope.rotation ) * delta );
                scope.position.z += ( scope.moveSpeed * Math.cos( scope.rotation ) * delta );

            }

            this.move( 0, 0 );

        }

        var moveDelta = Math.sqrt( Math.pow( scope.moveDirection.x, 2 ) + Math.pow( scope.moveDirection.y, 2 ) );

        // change 50 for correct delta

        if ( scope.moveDirection.x > 0 ) {

            scope.position.x += ( scope.moveSpeed * Math.sin( scope.rotation ) * delta );
            scope.position.z += ( scope.moveSpeed * Math.cos( scope.rotation ) * delta );

        } else if ( player.moveDirection.x < 0 ) {

            scope.position.x -= ( scope.moveSpeed * Math.sin( scope.rotation ) * delta );
            scope.position.z -= ( scope.moveSpeed * Math.cos( scope.rotation ) * delta );

        }

        if ( scope.moveDirection.y > 0 ) {

            scope.rotation += 0.001 * delta;

        } else if ( scope.moveDirection.y < 0 ) {

            scope.rotation -= 0.001 * delta;

        }

    }

    // update player PATH movement

    if ( ! scope.movePath.length ) return;

    var progress = scope.movementDurationMap.length - 1;

    for ( var j = 0, jl = scope.movementDurationMap.length; j < jl; j ++ ) {

        if ( time - scope.movementStart > scope.movementDurationMap[ j ] ) {

            progress --;

        } else {

            break;

        }

    }

    if ( progress < 0 ) {

        scope.position.x = scope.movePath[0];
        scope.position.z = scope.movePath[1];
        scope.movePath = false;
        scope.movementDurationMap = false;
        return;

    } else {

        if ( progress !== scope.moveProgress ) {

            var dx, dz;
            var dxr, dzr;

            if ( scope.movePath[ 2 * ( progress - 30 ) ] ) {

                dxr = ( scope.movePath[ 2 * ( progress - 30 ) + 0 ] + scope.movePath[ 2 * ( progress - 29 ) + 0 ] + scope.movePath[ 2 * ( progress - 28 ) + 0 ] ) / 3 - scope.position.x;
                dzr = ( scope.movePath[ 2 * ( progress - 30 ) + 1 ] + scope.movePath[ 2 * ( progress - 29 ) + 1 ] + scope.movePath[ 2 * ( progress - 28 ) + 1 ] ) / 3 - scope.position.z;

            } else {

                dxr = scope.movePath[ 2 * progress + 0 ] - scope.position.x;
                dzr = scope.movePath[ 2 * progress + 1 ] - scope.position.z;

            }

            dx = scope.stepDx = scope.movePath[ 2 * progress + 0 ] - scope.position.x;
            dz = scope.stepDz = scope.movePath[ 2 * progress + 1 ] - scope.position.z;

            scope.moveDt = Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) / scope.moveSpeed;

            // count new player angle when moving

            scope.newRotation = ( dzr === 0 && dxr !== 0 ) ? ( Math.PI / 2 ) * Math.abs( dxr ) / dxr : Math.atan2( dxr, dzr );
            scope.newRotation = utils.formatAngle( scope.newRotation );
            scope.dRotation = ( scope.newRotation - scope.rotation );

            if ( isNaN( scope.dRotation ) ) scope.dRotation = 0;

            if ( scope.dRotation > Math.PI ) {

                scope.dRotation -= 2 * Math.PI;

            }

            if ( scope.dRotation < - Math.PI ) {

                scope.dRotation += 2 * Math.PI;

            }

            scope.dRotation /= 20;
            scope.dRotCount = 20;

            //

            scope.moveProgress = progress;

        }

        if ( scope.dRotCount > 0 ) {

            scope.rotation = utils.addAngle( scope.rotation, scope.dRotation );
            scope.dRotCount --;

        }

        // making transition movement between path points

        var dx = delta * scope.stepDx / scope.moveDt;
        var dz = delta * scope.stepDz / scope.moveDt;
        var abs = Math.abs;

        if ( abs( dx ) <= abs( scope.stepDx ) && abs( dz ) <= abs( scope.stepDz ) ) {

            scope.position.x += dx;
            scope.position.z += dz;

        }

    }

};

Player.prototype.sendChatMessage = function ( data ) {

    var login = data.login;
    var message = data.message;
    var teamId = this.team.id;

    this.arena.announce( 'SendChatMessage', null, { login: login, message: message, teamId: teamId } );

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
        position:       this.position

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
