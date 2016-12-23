/*
 * @author ohmed
 * DatTank Player object
*/

var Player = function ( params ) {

    if ( Player.numIds > 1000 ) Player.numIds = 0;

    this.id = Player.numIds ++;
    this.login = params.login || 'guest';

    this.moveSpeed = 0.09;

    this.status = Player.Alive;

    this.socket = false;

    this.arena = false;
    this.team = false;
    this.health = 100;
    this.kills = 0;
    this.death = 0;

    this.hits = {};
    this.shootTimeout = false;

    this.movePath = [];
    this.movementDurationMap = [];
    this.movementDuration = 0;

    this.position = new DT.Vec3();
    this.rotation = 0;
    this.rotationTop = - Math.PI / 2;

    this.afkTimeout = false;

    this.baseRotationDirection = 0;
    this.moveDirection = 0;

    this.selectTank( params.tank );

};

Player.prototype = {};

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

    while ( Math.abs( offsetX ) < 50 && Math.abs( offsetZ ) < 50 ) {

        offsetX = ( Math.random() - 0.5 ) * 200;
        offsetZ = ( Math.random() - 0.5 ) * 200;        

    }

    this.position.x += offsetX;
    this.position.z += offsetZ;

    //

    DT.Network.announce( this.arena, 'respawn', { player: this.toPrivateJSON() } );

};

Player.prototype.selectTank = function ( tankName ) {

    switch ( tankName ) {

        case 'USAT54':

            this.tank = new DT.Tank.USAT54();
            break;

        case 'UKBlackPrince':

            this.tank = new DT.Tank.UKBlackPrince();
            break;

        default:

            this.tank = new DT.Tank.USAT54();
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
        bufferView[2] = Math.floor( 10 * angle );

        DT.Network.announce( this.arena, 'rotateTop', buffer, bufferView );

    };

}) ();

Player.prototype.rotateBase = function ( direction ) {

    this.baseRotationDirection = direction;

};

Player.prototype.move = function ( direction ) {

    this.moveDirection = direction;

};

Player.prototype.moveToPoint = function ( destination ) {

    if ( this.status !== Player.Alive ) {

        return;

    }

    var scope = this;

    this.arena.pathManager.findPath( this.position, destination, function ( path ) {

        var buffer = new ArrayBuffer( 2 * 2 * path.length + 2 + 2 + 2 * 2 );
        var bufferView = new Int16Array( buffer );

        bufferView[1] = scope.id;

        var offset = 2;

        for ( var i = 0, il = path.length; i < il; i ++ ) {

            bufferView[ 2 * i + 0 + offset ] = path[ i ].x;
            bufferView[ 2 * i + 1 + offset ] = path[ i ].z;

        }

        bufferView[ bufferView.length - 2 ] = destination.x;
        bufferView[ bufferView.length - 1 ] = destination.z;

        DT.Network.announce( scope.arena, 'MoveTankByPath', buffer, bufferView );

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

        var dx, dz;

        scope.movementDuration = 0;
        scope.movementDurationMap.length = 0;
        scope.movementStart = Date.now();

        for ( var i = path.length / 2 - 1; i > 0; i -- ) {

            dx = path[ 2 * ( i - 1 ) + 0 ] - path[ 2 * i + 0 ];
            dz = path[ 2 * ( i - 1 ) + 1 ] - path[ 2 * i + 1 ];

            scope.movementDurationMap.push( scope.movementDuration );
            scope.movementDuration += Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) / scope.moveSpeed;

        }

        scope.movePath = path;

    });

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

        }, 1000 );

        if ( this.ammo <= 0 ) {

            return;

        }

        this.ammo --;

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = Math.floor( 1000 * Math.random() );
        bufferView[ 3 ] = this.ammo;

        DT.Network.announce( this.arena, 'shoot', buffer, bufferView );

    };

}) ();

Player.prototype.hit = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( killer ) {

        if ( this.status !== Player.Alive ) {

            return;

        }

        if ( killer ) {

            if ( killer instanceof DT.Player ) {

                this.health -= 40 * ( killer.tank.bullet / this.tank.armour ) * ( 0.5 * Math.random() + 0.5 );
                this.health = Math.max( Math.round( this.health ), 0 );

            } else if ( killer instanceof DT.Tower ) {

                this.health -= 40 * ( 50 / this.tank.armour ) * ( 0.5 * Math.random() + 0.5 );
                this.health = Math.max( Math.round( this.health ), 0 );

            }

        }

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = this.health;

        DT.Network.announce( this.arena, 'hit', buffer, bufferView );

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

        bufferView[ 1 ] = this.id;

        if ( killer instanceof DT.Tower ) {

            bufferView[ 2 ] = killer.id + 10000;

        } else {

            bufferView[ 2 ] = killer.id;

        }

        //

        DT.Network.announce( this.arena, 'die', buffer, bufferView );

        //

        if ( this.bot ) { // tmp hack for bot respown

            var scope = this;

            if ( this.arena.players.length - this.arena.bots.length < 5 ) {

                setTimeout( this.respawn.bind( this ), 3000 );

            } else {

                setTimeout( function () {

                    scope.arena.removeBot( scope );
                    scope.arena.removePlayer( scope );

                }, 2000 );

            }

        } else if ( ! this.socket ) {

            this.arena.removePlayer( this );

        }

    };

}) ();

Player.prototype.update = (function () {

    return function ( delta, time ) {

        var player = this;

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

            player.movePath.length = 0;
            player.movementDurationMap.length = 0;
            return;

        } else {

            if ( progress !== player.moveProgress ) {

                var dx, dz;

                if ( player.movePath[ 2 * ( progress - 30 ) ] ) {

                    dx = ( player.movePath[ 2 * ( progress - 30 ) + 0 ] + player.movePath[ 2 * ( progress - 29 ) + 0 ] + player.movePath[ 2 * ( progress - 28 ) + 0 ] ) / 3 - player.position.x;
                    dz = ( player.movePath[ 2 * ( progress - 30 ) + 1 ] + player.movePath[ 2 * ( progress - 29 ) + 1 ] + player.movePath[ 2 * ( progress - 28 ) + 1 ] ) / 3 - player.position.z;

                } else {

                    dx = player.movePath[ 2 * progress + 0 ] - player.position.x;
                    dz = player.movePath[ 2 * progress + 1 ] - player.position.z;

                }

                player.position.x = player.movePath[ 2 * progress + 0 ];
                player.position.z = player.movePath[ 2 * progress + 1 ];

                //

                if ( progress !== 0 ) {

                    var newRotation = ( dz === 0 && dx !== 0 ) ? ( Math.PI / 2 ) * Math.abs( dx ) / dx : Math.atan2( dx, dz );
                    newRotation = utils.formatAngle( newRotation );
                    var dRotation = newRotation - player.rotation;

                    if ( isNaN( dRotation ) ) dRotation = 0;

                    if ( dRotation > Math.PI ) {

                        dRotation -= 2 * Math.PI;

                    }

                    if ( dRotation < - Math.PI ) {

                        dRotation += 2 * Math.PI;

                    }

                    player.rotation = utils.formatAngle( player.rotation + dRotation );

                }

                //

                player.moveProgress = progress;

            }

        }

        // update player AWSD movement

        // todo

    };

}) ();

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
Player.Alive = 100;
Player.Dead = 110;
Player.AFK = 120;

//

module.exports = Player;
