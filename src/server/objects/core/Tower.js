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
    this.cooldown = 1500;

    this.target = false;
    this.hits = {};

    this.bullets = [];

    this.rotation = 0;
    this.newRotation = 0;
    this.position = {
        x: params.position.x || 0,
        y: params.position.y || 0,
        z: params.position.z || 0
    };

    this.range = 300;
    this.armour = 350;

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

Tower.prototype.init = function () {

    var position = this.position;
    var sizeX = 30;
    var sizeY = 30;
    var sizeZ = 30;
    var id = this.id;

    this.arena.pathManager.placeObject( new Game.Vec3( position.x - sizeX / 2, 0, position.z - sizeZ / 2 ), new Game.Vec3( position.x + sizeX / 2, 0, position.z + sizeZ / 2 ) );
    this.arena.collisionManager.addObject( position, sizeX, sizeY, sizeZ, id );

    this.addEventListeners();

};

Tower.prototype.shoot = function ( target ) {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    var dx = target.position.x - this.position.x;
    var dz = target.position.z - this.position.z;
    var rotation, delta;

    if ( dz === 0 && dx !== 0 ) {

        rotation = ( dx > 0 ) ? - Math.PI : 0;

    } else {

        rotation = - Math.PI / 2 - Math.atan2( dz, dx );

    }

    delta = utils.formatAngle( rotation ) - utils.formatAngle( this.rotation );

    if ( Math.abs( delta ) > 0.5 ) return;

    //

    if ( Date.now() - this.shootTime < this.cooldown ) {

        return;

    }

    this.shootTime = Date.now();

    this.rotation = this.rotation + 1.57;

    // push tower bullet
    this.bullets.push({
        origPosition:   { x: this.position.x, y: 25, z: this.position.z },
        position:       { x: this.position.x, y: 25, z: this.position.z },
        angle:          this.rotation,
        id:             Tower.numShootId,
        ownerId:        this.id,
        flytime:        5
    });

    bufferView[1] = this.id;
    bufferView[2] = Tower.numShootId;

    Tower.numShootId = ( Tower.numShootId > 1000 ) ? 0 : Tower.numShootId + 1;

    this.arena.announce( 'TowerShoot', buffer, bufferView );

};

Tower.prototype.hit = function ( killer, shootId ) {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    var scope = this;

    if ( this.hits[ shootId ] ) return;

    setTimeout( function () {

        delete scope.hits[ shootId ];

    }, 1000 );

    killer = this.arena.playerManager.getById( killer );

    if ( ! killer ) return;
    if ( killer.team.id === this.team.id ) return;

    var amount = Math.floor( 57 * ( killer.tank.bullet / this.armour ) * ( 0.5 * Math.random() + 0.5 ) );

    if ( this.health - amount <= 0 ) {

        this.health = 0;
        this.changeTeam( killer.team );

        return;

    }

    //

    this.health -= amount;

    bufferView[ 1 ] = this.id;
    bufferView[ 2 ] = this.health;

    this.arena.announce( 'TowerHit', buffer, bufferView );

};

Tower.prototype.changeTeam = (function () {

    this.bullets = [];

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( team ) {

        this.team = team;
        this.health = 100;

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = team.id;

        this.arena.announce( 'TowerChangeTeam', buffer, bufferView );

    };

}) ();

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

Tower.prototype.rotateTop = (function () {

    var buffer = new ArrayBuffer( 8 );
    var bufferView = new Uint16Array( buffer );

    return function ( target, delta ) {

        var dx = target.position.x - this.position.x;
        var dz = target.position.z - this.position.z;
        var newRotation, deltaRot;

        if ( dz === 0 && dx !== 0 ) {

            newRotation = ( dx > 0 ) ? - Math.PI : 0;

        } else {

            newRotation = - Math.PI / 2 - Math.atan2( dz, dx );

        }

        //

        deltaRot = utils.formatAngle( this.newRotation ) - utils.formatAngle( this.rotation );

        if ( deltaRot > Math.PI ) {

            if ( delta > 0 ) {

                deltaRot = - 2 * Math.PI + deltaRot;

            } else {

                deltaRot = 2 * Math.PI + deltaRot;

            }

        }

        if ( Math.abs( deltaRot ) > 0.01 ) {

            this.rotation = utils.formatAngle( this.rotation + Math.sign( deltaRot ) / 30 * ( delta / 20 ) );

        }

        newRotation = utils.formatAngle( newRotation );

        //

        deltaRot = utils.formatAngle( newRotation ) - utils.formatAngle( this.newRotation );

        if ( Math.abs( deltaRot ) > 0.35 ) {

            this.newRotation = newRotation;

            bufferView[1] = this.id;
            bufferView[2] = Math.floor( 1000 * this.rotation );
            bufferView[3] = Math.floor( 1000 * this.newRotation );

            this.arena.announce( 'TowerRotateTop', buffer, bufferView );

        }

        //

        if ( Date.now() - this.shootTime > this.cooldown && Math.abs( newRotation - this.rotation ) < 0.5 ) {

            this.shoot( target );

        }

    };

}) ();

Tower.prototype.update = function ( delta ) {

    var target = false;
    var tower = this;

    // update tower shoted bullets

    if ( this.target ) {

        if ( this.target.team.id !== this.team.id && this.target.status === Game.Player.Alive ) {

            var dist = utils.getDistance( this.position, this.target.position );
            if ( dist < this.range ) {

                target = this.target;

                for ( var i = 0, il = tower.bullets.length; i < il; i ++ ) {

                    tower.bullets[ i ].flytime --;

                    if ( tower.bullets[ i ].flytime > 0 ) {

                        var bulletCollisionResult = tower.arena.collisionManager.moveBullet( tower.bullets[ i ], delta );

                        if ( bulletCollisionResult ) {

                            var bullet = tower.bullets.splice( i , 1 )[ 0 ];
                            i --;
                            il --;

                            this.arena.announce( 'BulletHit', null, { tower: { id: tower.id }, bulletId: bullet.id, position: bullet.position } );

                            var killer = tower.id;
                            var target = this.arena.playerManager.getById( bulletCollisionResult.id );

                            if ( target && target.hit ) {

                                target.hit( killer );

                            }

                        }

                    }

                }

            }

        }

    }

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

//

Tower.numIds = 1000;
Tower.numShootId = 0;
Tower.Alive = 100;
Tower.Dead = 101;

//

module.exports = Tower;
