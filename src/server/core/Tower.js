/*
 * @author ohmed
 * Tower object class
*/

var Tower = function ( arena, params ) {

    if ( Tower.numIds > 1000 ) Tower.numIds = 0;

    this.id = Tower.numIds ++;

    this.arena = arena;
    this.team = params.team || false;
    this.health = 100;
    this.shootTime = Date.now();
    this.cooldown = 1500;

    this.target = false;
    this.hits = {};

    this.rotation = 0;
    this.position = {
        x: params.position.x || 0,
        y: params.position.y || 0,
        z: params.position.z || 0
    };

    this.range = 300;
    this.armour = 350;

    //

    for ( var i in arena.teams ) {

        if ( arena.teams[ i ].id >= 1000 ) continue;

        if ( utils.getDistance( arena.teams[ i ].spawnPosition, this.position ) < 50 ) {

            this.team = arena.teams[ i ];
            break;

        }

    }

    //

    this.init();

};

Tower.prototype = {};

Tower.prototype.init = function () {

    var position = this.position;
    var sizeX = 130;
    var sizeY = 130;
    var sizeZ = 130;

    this.arena.pathManager.placeObject( new DT.Vec3( position.x - sizeX / 2, 0, position.z - sizeZ / 2 ), new DT.Vec3( position.x + sizeX / 2, 0, position.z + sizeZ / 2 ) );

};

Tower.prototype.shoot = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    this.hits = {};

    return function ( target ) {

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

        //

        bufferView[1] = this.id;
        bufferView[2] = Tower.numShootId;

        Tower.numShootId = ( Tower.numShootId > 1000 ) ? 0 : Tower.numShootId + 1;

        DT.Network.announce( this.arena, 'ShootTower', buffer, bufferView );

    };

}) ();

Tower.prototype.hit = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( killer ) {

        var amount = Math.floor( 57 * ( killer.tank.bullet / this.armour ) * ( 0.5 * Math.random() + 0.5 ) );

        if ( this.health - amount <= 0 ) {

            this.health = 0;
            this.changeTeam( killer.team );

            killer.team.kills ++;
            killer.kills ++;

            return;

        }

        //

        this.health -= amount;

        bufferView[ 1 ] = this.id + 10000;
        bufferView[ 2 ] = this.health;

        DT.Network.announce( this.arena, 'hit', buffer, bufferView );

    };

}) ();

Tower.prototype.changeTeam = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( team ) {

        this.team = team;
        this.health = 100;

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = team.id;

        DT.Network.announce( this.arena, 'TowerChangeTeam', buffer, bufferView );

    };

}) ();

Tower.prototype.checkForTarget = function ( players ) {

    var dist;
    var target = false;
    var minDistance = false;

    for ( var i = 0, il = players.length; i < il; i ++ ) {

        if ( players[ i ].team.id === this.team.id || players[ i ].status !== DT.Player.Alive ) {

            continue;

        }

        //

        dist = utils.getDistance( this.position, players[ i ].position );

        if ( dist > this.range ) continue;

        if ( ! minDistance || dist < minDistance ) {

            minDistance = dist;
            target = players[ i ];

        }

    }

    //

    return target;

};

Tower.prototype.rotateTop = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( target ) {

        var dx = target.position.x - this.position.x;
        var dz = target.position.z - this.position.z;
        var rotation, delta;

        if ( dz === 0 && dx !== 0 ) {

            rotation = ( dx > 0 ) ? - Math.PI : 0;

        } else {

            rotation = - Math.PI / 2 - Math.atan2( dz, dx );

        }

        delta = utils.formatAngle( rotation ) - utils.formatAngle( this.rotation );

        if ( Math.abs( delta ) > Math.PI ) {

            if ( delta > 0 ) {

                delta = - 2 * Math.PI + delta;

            } else {

                delta = 2 * Math.PI + delta;

            }

        }

        //

        if ( Math.abs( delta ) > 0.1 ) {

            if ( delta > 0 ) {

                this.rotation += 0.05;

            } else {

                this.rotation -= 0.05;

            }

        } else if ( Math.abs( delta ) > 0.05 ) {

            if ( delta > 0 ) {

                this.rotation += 0.005;

            } else {

                this.rotation -= 0.005;

            }

        } else {

            delta = 0;

        }

        if ( delta !== 0 ) {

            this.rotation = utils.formatAngle( this.rotation );

            bufferView[1] = this.id;
            bufferView[2] = Math.floor( 1000 * this.rotation );

            DT.Network.announce( this.arena, 'TowerRotateTop', buffer, bufferView );

        }

    };

}) ();

Tower.prototype.update = function () {

    var target = false;

    if ( this.target ) {

        if ( this.target.team.id !== this.team.id && this.target.status === DT.Player.Alive ) {

            var dist = utils.getDistance( this.position, this.target.position );
            if ( dist < this.range ) target = this.target;

        }

    }

    if ( ! target ) {

        target = this.checkForTarget( this.arena.players );
        this.target = target;

    }

    if ( ! target ) return;

    //

    this.rotateTop( target );
    this.shoot( target );

};

Tower.prototype.toJSON = function () {

    return {

        id:         this.id,
        team:       this.team.id,
        health:     this.health,
        position:   { x: this.position.x, y: this.position.y, z: this.position.z }

    };

};

//

Tower.numIds = 0;
Tower.numShootId = 0;
Tower.Alive = 100;
Tower.Dead = 101;

//

module.exports = Tower;
