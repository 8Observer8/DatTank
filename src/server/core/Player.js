/*
 * @author ohmed
 * DatTank Player object
*/

var Player = function ( params ) {

    this.id = Player.numIds ++;
    this.login = params.login || 'guest';

    this.moveSpeed = 0.09;

    this.status = 'alive';

    this.socket = false;

    this.arena = false;
    this.team = false;
    this.health = 100;
    this.ammo = 20;
    this.kills = 0;
    this.death = 0;

    this.hits = {};
    this.shootTimeout = false;

    this.movePath = [];
    this.movementDurationMap = [];
    this.movementDuration = 0;

    this.position = [ 0, 0, 0 ];
    this.rotation = 0;
    this.rotationTop = - Math.PI / 2;

    this.afkTimeout = false;

    //

    switch ( params.tank ) {

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

};

Player.prototype = {};

Player.prototype.reset = function () {

    this.status = 'alive';
    this.health = 100;
    this.ammo = 100;

    switch ( this.team.id ) {

        case 0:

            this.position = [ 500, 1, 500 ];
            break;

        case 1:

            this.position = [ -500, 1, 500 ];
            break;

        case 2:

            this.position = [ 500, 1, -500 ];
            break;

        case 3:

            this.position = [ -500, 1, -500 ];
            break;

    }

    this.rotation = 0;
    this.rotationTop = 0;

};

Player.prototype.respawn = function () {

    this.reset();

    //

    DT.Network.announce( this.arena.room, 'respawn', { player: this.toPrivateJSON() } );

};

Player.prototype.rotateTop = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( params ) {

        // this.rotation = params.baseAngle;
        this.rotationTop = params.topAngle;

        bufferView[1] = this.id;
        bufferView[2] = Math.floor( 100 * params.topAngle );

        if ( this.socket ) {

            DT.Network.broadcast( this.socket, 'arenaRoomId' + this.arena.id, 'rotateTop', buffer, bufferView );

        } else {

            DT.Network.announce( this.arena.room, 'rotateTop', buffer, bufferView );

        }

    };

}) ();

Player.prototype.move = function ( path ) {

    var dx, dz;

    this.movementDuration = 0;
    this.movementDurationMap.length = 0;
    this.movementStart = Date.now();

    for ( var i = path.length / 2 - 1; i > 0; i -- ) {

        dx = path[ 2 * ( i - 1 ) + 0 ] - path[ 2 * i + 0 ];
        dz = path[ 2 * ( i - 1 ) + 1 ] - path[ 2 * i + 1 ];

        this.movementDurationMap.push( this.movementDuration );
        this.movementDuration += Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) / this.moveSpeed;

    }

    this.movePath = path;

    //

    var pathBuffer = new ArrayBuffer( 2 * ( path.length + 2 ) );
    var pathBufferView = new Uint16Array( pathBuffer );

    pathBufferView[ 1 ] = this.id;

    for ( var i = 0, il = path.length; i < il; i ++ ) {

        pathBufferView[ 2 + i ] = path[ i ];

    }

    if ( this.socket ) {

        DT.Network.broadcast( this.socket, 'arenaRoomId' + this.arena.id, 'move', pathBuffer, pathBufferView );

    }

};

Player.prototype.shoot = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function () {

        var scope = this;

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

        DT.Network.announce( this.arena.room, 'shoot', buffer, bufferView );

    };

}) ();

Player.prototype.hit = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( killer ) {

        if ( this.status !== 'alive' ) {

            return;

        }

        if ( killer ) {

            this.health -= 40 * ( killer.tank.bullet / this.tank.armour ) * ( 0.5 * Math.random() + 0.5 );
            this.health = Math.max( this.health, 0 );

        }

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = this.health;

        DT.Network.announce( this.arena.room, 'hit', buffer, bufferView );

        if ( this.health <= 0 ) {

            this.die( killer );

        }

    };

}) ();

Player.prototype.die = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( killer ) {

        this.status = 'dead';

        killer.kills ++;
        this.death ++;

        killer.team.kills ++;
        this.team.death ++;

        bufferView[ 1 ] = this.id;
        bufferView[ 2 ] = killer.id;

        //

        DT.Network.announce( this.arena.room, 'die', buffer, bufferView );

        if ( this.socket === 'disconnected' ) {

            this.afkTimeout = setTimeout( this.arena.removePlayer.bind( this.arena, this ), 3000 );
            return;

        }

        if ( ! this.socket ) {

            setTimeout( this.respawn.bind( this ), 3000 );

        }

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

Player.numIds = 0;

//

module.exports = Player;
