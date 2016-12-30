/*
 * @author ohmed
 * DatTank Player object
*/

Game.Player = function ( arena, params ) {

    this.id = params.id;
    this.login = params.login || 'guest';

    this.status = 'alive';
    this.team = arena.teamManager.getById( params.team ) || false;

    this.health = params.health;
    this.ammo = params.ammo;

    this.kills = params.kills || 0;
    this.death = params.death || 0;

    //

    this.position = new THREE.Vector3( params.position.x, params.position.y, params.position.z );
    this.rotation = params.rotation;
    this.topRotation = params.rotationTop;

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

    this.lastShot = Date.now();

    //

    this.init( params );

};

Game.Player.prototype = {};

Game.Player.prototype.init = function ( params ) {

    this.selectTank( params.tank );
    this.tank.init();

    this.tank.setRotation( this.rotation )
    this.tank.setPosition( this.position.x, this.position.y, this.position.z );

};

Game.Player.prototype.selectTank = function ( tankName ) {

    switch ( tankName ) {

        case 'USA-T54':

            this.tank = new Game.Tank.USAT54({ player: this });
            break;

        case 'UK-BlackPrince':

            this.tank = new Game.Tank.UKBlackPrince({ player: this });
            break;

    }

    this.moveSpeed = this.moveSpeed * this.tank.speed / 40;

};

Game.Player.prototype.respawn = function ( fromNetwork, params ) {

    if ( view.shakeInterval !== false ) {

        clearInterval( view.shakeInterval );
        view.shakeInterval = false;

    }

    view.camera.position.y = 400;
    view.cameraOffset.set( 0, 0, 0 );

    //

    if ( fromNetwork ) {

        this.status = 'alive';
        this.ammo = params.ammo;
        this.health = params.health;

        this.position.set( params.position.x, params.position.y, params.position.z );
        this.rotation = params.rotation;
        this.topRotation = params.rotationTop;

        this.tank.reset();
        this.tank.setPosition( this.position.x, this.position.y, this.position.z );
        this.tank.setRotation( params.rotation );

        this.rotDelta = 0;
        this.rotationTopTarget = false;

        if ( this.id === Game.arena.me.id ) {

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
        this.moveSpeed = this.moveSpeed * this.tank.speed / 40;

        if ( Game.arena.me.id === this.id ) {

            ui.updateHealth( this.health );
            ui.updateAmmo( this.ammo );

            ui.hideContinueBox();
            ui.hideWinners();

            ui.updateHealth( this.health );
            ui.updateAmmo( this.ammo );

        }

        ui.updateLeaderboard( Game.arena.playerManager.players, Game.arena.me );

    } else {

        if ( Game.arena.me.id === this.id ) {

            ga('send', {
                hitType: 'event',
                eventCategory: 'game',
                eventAction: 'respown'
            });

            network.send( 'respawn' );

        }

    }

};

Game.Player.prototype.moveByPath = function ( compressedPath, destination ) {

    var path = this.deCompressPath( compressedPath );

    //

    path.push( this.position.x, this.position.z );
    path.unshift( destination.x, destination.z );
    path.unshift( destination.x, destination.z );

    var minDistIndex = 0;

    for ( var i = path.length / 2 - 1; i > 0; i -- ) {

        if ( Math.sqrt( Math.pow( this.position.x - path[ 2 * i + 0 ], 2 ) + Math.pow( this.position.z - path[ 2 * i + 1 ], 2 ) ) < 3 ) {

            minDistIndex = i;

        }

    }

    for ( var i = minDistIndex; i < path.length / 2; i ++ ) {

        path.pop();
        path.pop();

    }

    //

    this.processPath( path );

};

Game.Player.prototype.deCompressPath = function ( keyPath ) {

    var path = [];
    var s, e;

    for ( var i = 1, il = keyPath.length; i < il; i ++ ) {

        if ( keyPath[ i - 1 ].x - keyPath[ i ].x === 0 ) {

            if ( keyPath[ i - 1 ].z - keyPath[ i ].z < 0 ) s2 = 1; else s2 = -1;

            for ( var k = keyPath[ i - 1 ].z; k != keyPath[ i ].z; k += s2 ) {

                path.push( { x: keyPath[ i - 1 ].x, y: 0 - 5, z: k } );

            }

            continue;

        }

        if ( Math.abs( keyPath[ i - 1 ].z - keyPath[ i ].z ) === 0 ) {

            if ( keyPath[ i - 1 ].x - keyPath[ i ].x < 0 ) s1 = 1; else s1 = -1;

            for ( var k = keyPath[ i - 1 ].x; k != keyPath[ i ].x; k += s1 ) {

                path.push( { x: k, y: 0 - 5, z: keyPath[ i - 1 ].z } );

            }

            continue;

        }

        if ( Math.abs( keyPath[ i - 1 ].z - keyPath[ i ].z ) === Math.abs( keyPath[ i - 1 ].x - keyPath[ i ].x ) ) {

            var s1, s2;

            if ( keyPath[ i - 1 ].x - keyPath[ i ].x < 0 ) s1 = 1; else s1 = -1;
            if ( keyPath[ i - 1 ].z - keyPath[ i ].z < 0 ) s2 = 1; else s2 = -1;

            var cord = [];

            for ( var k = keyPath[ i - 1 ].x; k != keyPath[ i ].x; k += s1 ) {

                cord.push( { x: k, y: 0 - 5, z: 0 } );

            }

            var p = 0;

            for ( var k = keyPath[ i - 1 ].z; k != keyPath[ i ].z; k += s2 ) {

                cord[ p ].z = k;
                p ++;

            }

            for ( var k = 0, kl = cord.length; k < kl; k ++ ) {

                path.push( cord[ k ] );

            }

            continue;

        }

    }

    var newPath = [];

    for ( var i = 0, il = path.length; i < il; i ++ ) {

        newPath.push( path[ i ].x );
        newPath.push( path[ i ].z );

    }

    return newPath;

};

Game.Player.prototype.processPath = function ( path ) {

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

    scope.movePath = path;

};

Game.Player.prototype.rotateTop = function ( angle ) {

    if ( ! this.tank.object.top ) return;

    angle = angle - this.tank.object.rotation.y;
    angle = Utils.formatAngle( angle );

    this.rotationTopTarget = angle;
    this.topRotation = angle;
    this.tank.setTopRotation( angle );

};

Game.Player.prototype.shoot = function ( shootId, ammo ) {

    var scope = this;

    if ( this.status !== 'alive' ) return;

    if ( Game.arena.me.id === this.id && ( this.ammo <= 0 || Date.now() - this.lastShot < 1000 ) ) {

        return;

    }

    //

    if ( Game.arena.me.id === this.id ) {

        this.ammo = ammo;
        ui.updateAmmo( this.ammo );

    }

    this.tank.showBlastSmoke();
    this.tank.shootBullet().onHit( function ( target ) {

        if ( scope.team !== target.owner.team ) {

            var buffer = new ArrayBuffer( 8 );
            var bufferView = new Int16Array( buffer );

            bufferView[ 2 ] = shootId;
            bufferView[ 3 ] = scope.id;

            if ( target.name === 'tank' ) {

                bufferView[ 1 ] = target.owner.id;

            } else {

                bufferView[ 1 ] = 10000 + target.owner.id;

            }

            network.send( 'hit', buffer, bufferView );

        }

    });

    //

    if ( Game.arena.me.id === this.id ) {

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

    }

};

Game.Player.prototype.gotBox = function ( box, value ) {

    soundManager.menuSound.play();

    switch ( box.type ) {

        case 'Health':

            this.health = value;
            this.updateHealth();
            break;

        case 'Ammo':

            this.ammo = value;
            ui.updateAmmo( this.ammo );
            break;

        default:

            console.log('Unknown box type[' + box.type + '].');

    }

};

Game.Player.prototype.updateHealth = function ( value ) {

    value = ( value !== undefined ) ? value : this.health;

    //

    if ( Game.arena && Game.arena.me.id === this.id ) {

        if ( value < this.health ) {

            view.addCameraShake( 400, 3 );

        }

        this.health = value;
        ui.updateHealth( this.health );

    }

    this.health = value;

    if ( this.health <= 50 ) {

        this.tank.showSmoke();

    } else {

        this.tank.hideSmoke();

    }

};

Game.Player.prototype.die = function ( killer ) {

    if ( this.id === Game.arena.me.id ) {

        ga('send', {
            hitType: 'event',
            eventCategory: 'game',
            eventAction: 'kill'
        });

        view.addCameraShake( 1000, 1.5 );

        setTimeout( function () {

            if ( killer instanceof Game.Tower ) {

                ui.showContinueBox( '<br>' + killer.team.name + ' team tower', killer.team.color ); 

            } else {

                ui.showContinueBox( killer.login, killer.team.color ); 

            }

        }, 1400 );

    }

    ui.showKills( killer, this );

    if ( killer ) {

        killer.team.kills ++;
        killer.kills ++;

    }

    this.team.death ++;
    this.death ++;

    this.movePath = false;
    this.moveProgress = false;
    this.movementDurationMap = false;

    ui.updateLeaderboard( Game.arena.playerManager.players, Game.arena.me );

    this.tank.destroy();

};

Game.Player.prototype.dispose = function () {

    this.tank.dispose();
    this.tank = false;

};
