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

    this.status = Player.Alive;

    this.socket = params.socket || false;

    if ( this.socket ) {

        this.socket.player = this;
        this.socket.arena = arena;

    }

    this.arena = arena || false;
    this.team = false;
    this.health = 100;
    this.kills = 0;
    this.death = 0;

    this.hits = {};
    this.shootTimeout = false;

    this.movePath = false;
    this.movementDurationMap = false;
    this.movementDuration = 0;

    this.position = new Game.Vec3();
    this.rotation = 0;
    this.rotationTop = - Math.PI / 2;
    this.lastUpdatedTopRotation = - Math.PI / 2;

    this.afkTimeout = false;

    this.moveDelay = false;

    this.pathFindIter = 0;

    this.selectTank( params.tank );

    //

    this.addEventListeners();

};

Player.prototype = Object.create( Game.EventDispatcher.prototype );

Player.prototype.respawn = function () {

    this.status = Player.Alive;
    this.health = 100;
    this.ammo = this.tank.maxShells;
    this.hits = {};
    this.position.set( this.team.spawnPosition.x, this.team.spawnPosition.y, this.team.spawnPosition.z );
    this.rotation = 0;
    this.rotationTop = 0;

    //

    var offsetX = 0;
    var offsetZ = 0;

    while ( Math.sqrt( offsetX * offsetX + offsetZ * offsetZ ) < 80 ) {

        offsetX = ( Math.random() - 0.5 ) * 150;
        offsetZ = ( Math.random() - 0.5 ) * 150;        

    }

    this.position.x += offsetX;
    this.position.z += offsetZ;

    //

    this.arena.announce( 'ArenaPlayerRespawn', null, { player: this.toPrivateJSON() } );

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

    this.moveSpeed = this.moveSpeed * this.tank.speed / 40;
    this.ammo = this.tank.maxShells;

};

Player.prototype.rotateTop = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Int16Array( buffer );

    return function ( angle ) {

        if ( this.status !== Player.Alive ) {

            return;

        }

        this.rotationTop = angle;

        bufferView[1] = this.id;
        bufferView[2] = Math.floor( 1000 * angle );

        this.arena.announce( 'PlayerTankRotateTop', buffer, bufferView );
        this.lastUpdatedTopRotation = angle;

    };

}) ();

Player.prototype.rotateBase = function ( direction ) {

    this.baseRotationDirection = direction;

};

Player.prototype.move = (function () {

    var buffer = new ArrayBuffer( 12 );
    var bufferView = new Uint16Array( buffer );

    return function ( directionX, directionZ ) {

        var scope = this;

        if ( scope.status !== Player.Alive ) {

            return;

        }

        scope.movePath = false;
        scope.movementDurationMap = false;
        scope.movementDuration = 0;

        scope.moveDirection.x = directionX;
        scope.moveDirection.y = directionZ;

        if ( scope.moveDirection.x !== 0 || scope.moveDirection.y !== 0 ) {

            var targetRotation = Math.atan2( scope.moveDirection.y, scope.moveDirection.x ) - Math.PI / 2;
            var deltaRot = targetRotation - scope.rotation;
            if ( deltaRot > Math.PI ) deltaRot = deltaRot - 2 * Math.PI;
            if ( deltaRot < - Math.PI ) deltaRot = deltaRot + 2 * Math.PI;
            scope.rotation = ( scope.rotation + deltaRot / 10 ) % ( 2 * Math.PI );

        }

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = directionX;
        bufferView[ 3 ] = directionZ;
        bufferView[ 4 ] = this.position.x;
        bufferView[ 5 ] = this.position.z;

        // console.log(this.position);

        this.arena.announce( 'PlayerTankMove', buffer, bufferView );

    };

}) ();

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

        scope.arena.announce( 'PlayerTankMoveByPath', buffer, bufferView );

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

Player.prototype.shoot = (function () {

    var buffer = new ArrayBuffer( 8 );
    var bufferView = new Uint16Array( buffer );

    return function () {

        var scope = this;

        if ( this.status !== Player.Alive ) {

            return;

        }

        if ( this.shootTimeout ) return;

        this.shootTimeout = setTimeout( function () {

            scope.shootTimeout = false;
            
        }, this.tank.reloadTime );

        this.hits = {};

        if ( this.ammo <= 0 ) {

            return;

        }

        this.ammo --;

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = Player.numShootId;
        bufferView[ 3 ] = this.ammo;

        Player.numShootId = ( Player.numShootId > 1000 ) ? 0 : Player.numShootId + 1;

        this.arena.announce( 'PlayerTankShoot', buffer, bufferView );

    };

}) ();

Player.prototype.hit = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( shootId, killer ) {

        var scope = this;

        if ( this.status !== Player.Alive ) {

            return;

        }

        if ( this.hits[ shootId ] ) return;
        this.hits[ shootId ] = 1;
        setTimeout( function () {

            delete scope.hits[ shootId ];

        }, 1000 );

        killer = this.arena.playerManager.getById( killer ) || this.arena.towerManager.getById( killer );

        if ( killer ) {

            if ( killer instanceof Game.Player ) {

                this.health -= 40 * ( killer.tank.bullet / this.tank.armour ) * ( 0.5 * Math.random() + 0.5 );
                this.health = Math.max( Math.round( this.health ), 0 );

            } else if ( killer instanceof Game.Tower ) {

                this.health -= 40 * ( 50 / this.tank.armour ) * ( 0.5 * Math.random() + 0.5 );
                this.health = Math.max( Math.round( this.health ), 0 );

            }

        }

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = this.health;

        this.arena.announce( 'PlayerTankHit', buffer, bufferView );

        if ( this.health <= 0 ) {

            this.die( killer );

        }

    };

}) ();

Player.prototype.die = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( killer ) {

        if ( this.status === Player.Dead ) return;

        this.status = Player.Dead;

        killer.kills ++;
        this.death ++;

        killer.team.kills ++;
        this.team.death ++;

        this.movePath = false;
        this.moveProgress = false;
        this.movementDurationMap = false;

        this.moveDirection.x = 0;
        this.moveDirection.y = 0;

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = killer.id;

        this.arena.announce( 'PlayerTankDied', buffer, bufferView );

        //

        if ( this.bot ) { // tmp hack for bot respown

            var scope = this;

            if ( this.arena.playerManager.players.length - this.arena.botManager.bots.length < 5 ) {

                setTimeout( this.respawn.bind( this ), 3000 );

            } else {

                setTimeout( function () {

                    scope.arena.botManager.remove( scope );
                    scope.arena.removePlayer( scope );

                }, 2000 );

            }

        } else if ( ! this.socket ) {

            this.arena.removePlayer( this );

        }

    };

}) ();

Player.prototype.update = function ( delta, time ) {

    var player = this;

    // update player AWSD movement

    if ( player.moveDirection.x !== 0 || player.moveDirection.y !== 0 ) {

        var moveDelta = Math.sqrt( Math.pow( player.moveDirection.x, 2 ) + Math.pow( player.moveDirection.y, 2 ) );

        player.position.x -= Math.sign( player.moveDirection.x ) / moveDelta * player.moveSpeed * delta;
        player.position.z += Math.sign( player.moveDirection.y ) / moveDelta * player.moveSpeed * delta;


        if ( player.position.z > 1270 ) {

            player.moveDirection.y = ( player.moveDirection.y !== 1 ) ? 0 : 0;
            player.moveDirection.x = 0;

        } else if ( player.position.z < -1270 ) {

            player.moveDirection.y = ( player.moveDirection.y !== -1 ) ? 0 : 0;
            player.moveDirection.x = 0;

        } else if ( player.position.x > 1270 ) {

            player.moveDirection.x = ( player.moveDirection.x !== 1 ) ? 0 : 0;
            player.moveDirection.y = 0;

        } else if ( player.position.x < -1270 ) {

            player.moveDirection.x = ( player.moveDirection.x !== -1 ) ? 0 : 0;
            player.moveDirection.y = 0;

        }

    }

    // update player PATH movement

    if ( ! player.movePath.length ) return;

    var progress = player.movementDurationMap.length - 1;

    for ( var j = 0, jl = player.movementDurationMap.length; j < jl; j ++ ) {

        if ( time - player.movementStart > player.movementDurationMap[ j ] ) {

            progress --;

        } else {

            break;

        }

    }

    if ( progress < 0 ) {

        player.position.x = player.movePath[0];
        player.position.z = player.movePath[1];
        player.movePath = false;
        player.movementDurationMap = false;
        return;

    } else {

        if ( progress !== player.moveProgress ) {

            var dx, dz;
            var dxr, dzr;

            if ( player.movePath[ 2 * ( progress - 30 ) ] ) {

                dxr = ( player.movePath[ 2 * ( progress - 30 ) + 0 ] + player.movePath[ 2 * ( progress - 29 ) + 0 ] + player.movePath[ 2 * ( progress - 28 ) + 0 ] ) / 3 - player.position.x;
                dzr = ( player.movePath[ 2 * ( progress - 30 ) + 1 ] + player.movePath[ 2 * ( progress - 29 ) + 1 ] + player.movePath[ 2 * ( progress - 28 ) + 1 ] ) / 3 - player.position.z;

            } else {

                dxr = player.movePath[ 2 * progress + 0 ] - player.position.x;
                dzr = player.movePath[ 2 * progress + 1 ] - player.position.z;

            }

            dx = player.stepDx = player.movePath[ 2 * progress + 0 ] - player.position.x;
            dz = player.stepDz = player.movePath[ 2 * progress + 1 ] - player.position.z;

            player.moveDt = Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) / player.moveSpeed;

            // count new player angle when moving

            player.newRotation = ( dzr === 0 && dxr !== 0 ) ? ( Math.PI / 2 ) * Math.abs( dxr ) / dxr : Math.atan2( dxr, dzr );
            player.newRotation = utils.formatAngle( player.newRotation );
            player.dRotation = ( player.newRotation - player.rotation );

            if ( isNaN( player.dRotation ) ) player.dRotation = 0;

            if ( player.dRotation > Math.PI ) {

                player.dRotation -= 2 * Math.PI;

            }

            if ( player.dRotation < - Math.PI ) {

                player.dRotation += 2 * Math.PI;

            }

            player.dRotation /= 20;
            player.dRotCount = 20;

            //

            player.moveProgress = progress;

        }

        if ( player.dRotCount > 0 ) {

            player.rotation = utils.addAngle( player.rotation, player.dRotation );
            player.dRotCount --;

        }

        // making transition movement between path points

        var dx = delta * player.stepDx / player.moveDt;
        var dz = delta * player.stepDz / player.moveDt;
        var abs = Math.abs;

        if ( abs( dx ) <= abs( player.stepDx ) && abs( dz ) <= abs( player.stepDz ) ) {

            player.position.x += dx;
            player.position.z += dz;

        }

    }

};

Player.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'ArenaPlayerRespawn', function ( event ) { scope.respawn(); });
    this.addEventListener( 'PlayerTankRotateTop', function ( event ) { scope.rotateTop( event.data[0] / 1000 ); });
    this.addEventListener( 'PlayerTankMove', function ( event ) { scope.move( event.data[0], event.data[1] ); });
    this.addEventListener( 'PlayerTankMoveByPath', function ( event ) { scope.moveToPoint({ x: event.data[0], z: event.data[1] }); });
    this.addEventListener( 'PlayerTankShoot', function ( event ) { scope.shoot(); });
    this.addEventListener( 'PlayerTankHit', function ( event ) { scope.hit( event.data[1], event.data[2] ); });

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
        ammo:           this.ammo,
        rotation:       this.rotation,
        rotationTop:    this.rotationTop,
        position:       this.position,
        kills:          this.kills,
        death:          this.death

    };

};

Player.numIds = 1;
Player.numShootId = 0;
Player.Alive = 100;
Player.Dead = 110;
Player.AFK = 120;

//

module.exports = Player;
