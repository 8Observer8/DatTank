/*
 * @author ohmed
 * DatTank Player object
*/

'use strict';

DT.Player = function ( arena, params ) {

    this.id = params.id;
    this.login = params.login || 'guest';

    this.status = 'alive';

    this.health = params.health;
    this.ammo = params.ammo;

    this.kills = params.kills || 0;
    this.death = params.death || 0;

    //

    this.team = params.team;
    this.position = new THREE.Vector3( params.position[0], params.position[1], params.position[2] );
    this.rotation = params.rotation;

    this.topRotation = params.rotationTop;

    // keyMovement 

    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;

    //
    
    this.moveProgress = false;
    this.movePath = false;
    this.movementStart = false;
    this.stepDx = this.stepDy = this.stepDz = 0;
    this.moveDt = 0;
    this.moveSpeed = 0.09;
    this.movementDurationMap = [];

    this.rotDelta = 0;
    this.rotationTopTarget = false;

    //

    this.lastShot = Date.now();

    this.tank = new DT.Tank.USAT54({ player: this });
    this.init();

};

DT.Player.prototype = {};

DT.Player.prototype.init = function () {

    this.tank.init();

    this.tank.setRotation( this.rotation )
    this.tank.setPosition( this.position.x, this.position.y, this.position.z );

};

DT.Player.prototype.respawn = function ( fromNetwork, params ) {

    if ( fromNetwork ) {

        this.status = 'alive';
        this.ammo = 100;
        this.health = 100;

        this.position.set( params.position[0], params.position[1], params.position[2] );
        this.rotation = params.rotation;
        this.topRotation = params.rotationTop;

        this.tank.reset();
        this.tank.setPosition( this.position.x, this.position.y, this.position.z );
        this.tank.setRotation( params.rotation );

        this.rotDelta = 0;
        this.rotationTopTarget = false;

        if ( this.id === DT.arena.me.id ) {

            view.camera.position.set( this.position.x + 180, view.camera.position.y, this.position.z );
            view.camera.lookAt( this.position );

            view.sunLight.position.set( this.position.x - 100, view.sunLight.position.y, this.position.z + 100 );
            view.sunLight.target = this.tank.object;
            view.sunLight.target.updateMatrixWorld();

        }

        this.lastShot = Date.now();

        this.moveProgress = false;
        this.movePath = false;
        this.movementStart = false;
        this.stepDx = this.stepDy = this.stepDz = 0;
        this.moveDt = 0;
        this.moveSpeed = 0.09;

        if ( DT.arena.me.id === this.id ) {

            ui.updateHealth( this.health );
            ui.updateAmmo( this.ammo );

            ui.hideContinueBox();
            ui.hideWinners();

            ui.updateHealth( this.health );
            ui.updateAmmo( this.ammo );

        }

        ui.updateLeaderboard( DT.arena.players );

    } else {

        if ( DT.arena.me.id === this.id ) {

            ga('send', {
                hitType: 'event',
                eventCategory: 'game',
                eventAction: 'respown'
            });

            network.send( 'respawn' );

        }

    }

};

DT.Player.prototype.move = function ( destination, fromServer ) {

    var scope = this;

    DT.arena.pathFinder.findPath( this.position, destination, function ( path ) {

        if ( path.length === 0 ) {

            scope.move( { x: destination.x + 10, y: 0, z: destination.z + 10 }, fromServer );
            return;

        }

        path.push( scope.position.x, scope.position.z );
        path.unshift( destination.x, destination.z );
        path.unshift( destination.x, destination.z );

        //

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

        //

        if ( ! fromServer ) {

            var arrayBuffer = new ArrayBuffer( 2 * ( 1 + path.length ) );
            var arrayBufferView = new Uint16Array( arrayBuffer );

            for ( var i = 0, il = path.length; i < il; i ++ ) {

                arrayBufferView[ i + 1 ] = path[ i ] + 2000;

            }

            network.send( 'move', arrayBuffer, arrayBufferView );

        } else {

            var arrayBuffer = new ArrayBuffer( 2 * ( 2 + path.length ) );
            var arrayBufferView = new Uint16Array( arrayBuffer );

            arrayBufferView[ 1 ] = scope.id;

            for ( var i = 0, il = path.length; i < il; i ++ ) {

                arrayBufferView[ i + 2 ] = path[ i ] + 2000;

            }

            network.send( 'move1', arrayBuffer, arrayBufferView );

        }

    });

};

DT.Player.prototype.processPath = function ( path ) {

    var scope = this;

    this.movementStart = Date.now();
    this.movementDuration = 0;
    this.moveProgress = false;
    this.movementDurationMap = [];
    this.moveProgress = path.length / 2;

    var dx, dz;

    for ( var i = path.length / 2 - 1; i > 0; i -- ) {

        dx = path[ 2 * ( i - 1 ) + 0 ] - path[ 2 * i + 0 ];
        dz = path[ 2 * ( i - 1 ) + 1 ] - path[ 2 * i + 1 ];

        this.movementDurationMap.push( this.movementDuration );
        this.movementDuration += Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) / this.moveSpeed;

    }

    setTimeout( function () {

        scope.movePath = path;

    }, 10 );

};

DT.Player.prototype.rotateTop = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Uint16Array( buffer );

    return function ( angle, fromNetwork ) {

        var scope = this;

        if ( ! this.tank.object.top ) return;

        //

        if ( ! fromNetwork ) {

            angle = angle - this.tank.object.rotation.y;

        }

        angle = Utils.formatAngle( angle );

        this.rotationTopTarget = angle;
        this.topRotation = angle;
        this.tank.setTopRotation( angle );

        if ( DT.arena.me.id === this.id ) {

            bufferView[ 1 ] = Math.floor( angle * 100 );
            bufferView[ 2 ] = Math.floor( scope.rotation * 100 );

            if ( ! this.rotateTopNetworkEmitTimeout ) {

                this.rotateTopNetworkEmitTimeout = setTimeout( function () {

                    network.send( 'rotateTop', buffer, bufferView );
                    scope.rotateTopNetworkEmitTimeout = false;

                }, 200 );

            }

        }

    };

}) ();

DT.Player.prototype.shoot = (function () {

    var buffer = new ArrayBuffer( 8 );
    var bufferView = new Uint16Array( buffer );

    return function ( shootId ) {

        var scope = this;

        if ( ! shootId ) {

            network.send( 'shoot' );
            return;

        }

        if ( DT.arena.me.id === this.id && ( this.ammo <= 0 || Date.now() - this.lastShot < 1000 ) ) {

            return;

        }

        //

        this.tank.showBlastSmoke();
        this.tank.shootBullet().onHit( function ( target ) {

            if ( scope.team !== target.owner.team ) {

                bufferView[ 1 ] = target.owner.id;
                bufferView[ 2 ] = shootId;
                bufferView[ 3 ] = scope.id;

                network.send( 'hit', buffer, bufferView );

            }

        });

        //

        if ( DT.arena.me.id === this.id ) {

            scope.lastShot = Date.now();
            var element = $('#empty-ammo-image');
            // -> removing the class
            element.removeClass('ammo-animation');
            element.css( 'height', '100%' );

            // -> triggering reflow / The actual magic /
            // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
            element[0].offsetWidth;
            element.css( 'background-image', 'url(../resources/img/ammo.png)' );

            // -> and re-adding the class
            element.addClass('ammo-animation');

            //

            scope.ammo --;
            ui.updateAmmo( this.ammo );

        }

    };

}) ();

DT.Player.prototype.hit = function () {

    if ( DT.arena && DT.arena.me.id === this.id ) {

        ui.updateHealth( this.health );

    }

    if ( this.health <= 50 ) {

        this.tank.showSmoke();

    } else {

        this.tank.hideSmoke();

    }

};

DT.Player.prototype.die = function ( killer ) {

    if ( this.id === DT.arena.me.id ) {

        ga('send', {
            hitType: 'event',
            eventCategory: 'game',
            eventAction: 'kill'
        });

        ui.showContinueBox();

    }

    ui.showKills( killer, this );

    DT.arena.teams[ killer.team ].kills ++;
    DT.arena.teams[ this.team ].death ++;

    this.movePath = [];

    this.death ++;
    killer.kills ++;

    ui.updateTeamScore( DT.arena.teams );
    ui.updateLeaderboard( DT.arena.players, DT.Arena.me );

    this.tank.destroy();

};

DT.Player.prototype.dispose = function () {

    this.tank.dispose();
    this.tank = false;

};
