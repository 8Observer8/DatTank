/*
 * @author ohmed
 * DatTank Player object
*/

Game.Player = function ( arena, params ) {

    EventDispatcher.call( this );

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
    this.positionCorrection = new THREE.Vector3( 0, 0, 0 );
    this.rotation = params.rotation;
    this.topRotation = params.rotationTop;

    //

    this.moveSpeed = 0.09;
    this.originalMoveSpead = this.moveSpeed;
    this.moveDirection = new THREE.Vector2( params.moveDirection.x || 0, params.moveDirection.y || 0 );

    this.explosion = [];
    this.bulletSpeed = 1.3;

    //

    this.init( params );

};

Game.Player.prototype = Object.create( EventDispatcher.prototype );

//

Game.Player.prototype.init = function ( params ) {

    this.selectTank( params.tank );

    this.tank.init();
    this.tank.setRotation( this.rotation );
    this.tank.setPosition( this.position.x, this.position.y, this.position.z );

    this.addEventListeners();

    this.healthBar = false;
    this.updateHealthBar();

};

Game.Player.prototype.selectTank = function ( tankName ) {

    switch ( tankName ) {

        case 'USA-T54':

            this.tank = new Game.Tank.USAT54({ player: this });
            break;

        case 'UK-BlackPrince':

            this.tank = new Game.Tank.UKBlackPrince({ player: this });
            break;

        case 'D-32':

            this.tank = new Game.Tank.D32({ player: this });
            break;

    }

    this.moveSpeed = this.originalMoveSpead * this.tank.speed / 40;

};

Game.Player.prototype.respawn = function ( fromNetwork, params ) {

    if ( view.shakeInterval !== false ) {

        clearInterval( view.shakeInterval );
        view.shakeInterval = false;

    }

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

        if ( this.id === Game.arena.me.id ) {

            view.camera.position.set( this.position.x + 180, view.camera.position.y, this.position.z );
            view.camera.lookAt( this.position );

        }

        this.moveSpeed = 0.09;
        this.moveSpeed = this.moveSpeed * this.tank.speed / 40;

        var tankName = params.tank;
        this.tank.dispose();
        this.selectTank( tankName );
        this.tank.init();

        this.healthBar = false;
        this.updateHealthBar();

        if ( Game.arena.me.id === this.id ) {

            ui.updateHealth( this.health );
            ui.updateAmmo( this.ammo );

            ui.hideContinueBox();
            ui.updateAmmo( this.ammo );

        }

    } else {

        if ( Game.arena.me.id === this.id ) {

            ga('send', {
                hitType: 'event',
                eventCategory: 'game',
                eventAction: 'respawn'
            });

            var tank = localStorage.getItem( 'currentTank' ) || 0;
            network.send( 'ArenaPlayerRespawn', false, tank );

        }

    }

};

Game.Player.prototype.move = function ( directionX, directionZ, positionX, positionZ, rotation ) {

    var player = this;

    player.moveDirection.x = directionX;
    player.moveDirection.y = directionZ;

    player.positionCorrection.set( positionX - player.position.x, 0, positionZ - player.position.z );

    player.rotation = rotation / 1000.0;

    player.tank.setRotation( player.rotation );
    player.tank.setPosition( player.position.x, player.position.y, player.position.z );

};

Game.Player.prototype.updateDirectionMovement = function ( time, delta ) {

    var player = this;

    //

    player.tank.update( delta );

    if ( player.moveDirection.x !== 0 || player.moveDirection.y !== 0 ) {

        if ( player.tank.sounds.moving.buffer && ! player.tank.sounds.moving.isPlaying ) {

            if ( localStorage.getItem('sound') !== 'false' ) {

                player.tank.sounds.moving.play();
                player.tank.sounds.moving.isPlaying = true;

            }

        }

        player.tank.addTrack();

        if ( player.moveDirection.x > 0 ) {

            player.position.x += ( player.moveSpeed * Math.sin( player.rotation ) * delta );
            player.position.z += ( player.moveSpeed * Math.cos( player.rotation ) * delta );

        } else if ( player.moveDirection.x < 0 ) {

            player.position.x -= ( player.moveSpeed * Math.sin( player.rotation ) * delta );
            player.position.z -= ( player.moveSpeed * Math.cos( player.rotation ) * delta );

        }

        if ( player.moveDirection.y > 0 ) {

            player.rotation += 0.001 * delta;

        } else if ( player.moveDirection.y < 0 ) {

            player.rotation -= 0.001 * delta;

        }

        player.tank.setRotation( player.rotation );

    } else {

        if ( player.tank.sounds.moving.buffer && player.tank.sounds.moving.isPlaying ) {

            player.tank.sounds.moving.stop();
            player.tank.sounds.moving.startTime = false;
            player.tank.sounds.moving.isPlaying = false;

        }

    }

    player.tank.setPosition( player.position.x, player.position.y, player.position.z );

};

Game.Player.prototype.rotateTop = function ( angle ) {

    if ( ! this.tank.object.top ) return;

    angle = Utils.formatAngle( angle );
    this.topRotation = angle;
    this.tank.setTopRotation( angle );

};

Game.Player.prototype.shoot = function ( bulletId ) {

    var scope = this;

    if ( this.status !== 'alive' ) return;

    if ( Game.arena.me.id === this.id ) {

        this.ammo --;
        ui.updateAmmo( this.ammo );

    }

    this.tank.showBlastSmoke();
    this.tank.shootBullet( bulletId );

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

Game.Player.prototype.gotBox = function ( data ) {

    var box = data.box;
    var value = data.value;

    if ( localStorage.getItem('sound') === 'true' ) {

        soundManager.menuSound.play();

    }

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
            break;

    }

};

Game.Player.prototype.updateHealth = function ( value ) {

    value = ( value !== undefined ) ? value : this.health;

    //

    if ( Game.arena && Game.arena.me.id === this.id ) {

        if ( value < this.health ) {

            view.addCameraShake( 300, 3 );

        }

        this.health = value;
        ui.updateHealth( this.health );
        this.updateHealthBar( this.health );

    } else {

        this.health = value;
        this.updateHealthBar( this.health );

    }

    this.health = value;

    if ( this.health <= 50 ) {

        this.tank.showSmoke();

    } else {

        this.tank.hideSmoke();

    }

};

Game.Player.prototype.updateHealthBar = function () {

    if ( ! this.healthBar ) {

        var bg = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0xffffff, fog: true } ) );
        var healthBar = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0x00ff00, fog: true } ) );

        healthBar.position.set( 0, 50, 0 );
        healthBar.scale.set( 50, 2, 1 );

        this.healthBar = {
            bg:     bg,
            health: healthBar
        };

        this.tank.object.add( this.healthBar.health );

    }

    this.healthBar.health.scale.x = 50 * this.health / 100;

};

Game.Player.prototype.update = function ( time, delta ) {

    this.updateDirectionMovement( time, delta );
    this.updateExplosion( delta );

    //

    var dx = this.positionCorrection.x * ( delta / 500 );
    var dz = this.positionCorrection.z * ( delta / 500 );

    if ( Math.abs( dx ) > 0.1 || Math.abs( dz ) > 0.1 ) {

        this.positionCorrection.x -= dx;
        this.positionCorrection.z -= dz;

        this.position.x += dx;
        this.position.z += dz;

    }

    //

    for ( var bulletId in this.tank.bullets ) {

        var bullet = this.tank.bullets[ bulletId ];

        if ( bullet.visible === true ) {

            var x = bullet.position.x + this.bulletSpeed * Math.cos( bullet.directionRotation ) * delta;
            var z = bullet.position.z + this.bulletSpeed * Math.sin( bullet.directionRotation ) * delta;
            bullet.position.set( x, bullet.position.y, z );

            bullet.trace.position.set( ( x + bullet.startPos.x ) / 2, bullet.position.y, ( z + bullet.startPos.z ) / 2 );
            var dx = x - bullet.startPos.x;
            var dz = z - bullet.startPos.z;
            bullet.trace.scale.x = Math.sqrt( dx * dx + dz * dz ) / 3;
            bullet.trace.material.opacity = Math.max( 0.5 - bullet.trace.scale.x / 280, 0 );

        }

    }

};

Game.Player.prototype.die = function ( killer ) {

    var scope = this;

    killer = Game.arena.playerManager.getById( killer ) || Game.arena.towerManager.getById( killer );
    if ( ! killer ) return;

    if ( this.id === killer.id ) {

        ga('send', {
            hitType: 'event',
            eventCategory: 'game',
            eventAction: 'kill'
        });

    }

    if ( this.id === Game.arena.me.id ) {

        view.addCameraShake( 1000, 1.5 );

        setTimeout( function () {

            if ( killer instanceof Game.Tower ) {

                ui.showContinueBox( '<br>' + killer.team.name + ' team tower', killer.team.color );

            } else {

                ui.showContinueBox( killer.login, killer.team.color );

            }

            scope.tank.object.visible = false;

        }, 1400 );

        controls.stopShooting();

    }

    ui.showKills( killer, this );

    this.moveDirection.x = 0;
    this.moveDirection.y = 0;

    this.tank.destroy();

};

Game.Player.prototype.dispose = function () {

    this.tank.dispose();
    this.tank = false;

};

Game.Player.prototype.showExplosion = function ( data ) {

    var scale = 30;
    var map = resourceManager.getTexture( 'explosion2.png' ).clone();
    map.needsUpdate = true;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set( 0.25, 0.25 );
    map.offset.set( 0, 0.75 );

    var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, opacity: 0.7, fog: true });
    var sprite = new THREE.Sprite( material );

    sprite.position.set( data.position.x, data.position.y, data.position.z );
    sprite.scale.set( scale, scale, scale );
    sprite.visible = true;
    view.scene.add( sprite );
    this.explosion.push( sprite );

};

Game.Player.prototype.updateExplosion = function ( delta ) {

    if ( ! this.explosion ) return;

    for ( var i = 0, il = this.explosion.length; i < il; i ++ ) {

        this.explosion[ i ].time = this.explosion[ i ].time || 0;
        this.explosion[ i ].time += delta;

        if ( this.explosion[ i ].time > 50 ) {

            if ( this.explosion[ i ].material.map.offset.y > 0 ) {

                this.explosion[ i ].material.map.offset.x += 0.25;
                this.explosion[ i ].time = 0;

                if ( this.explosion[ i ].material.map.offset.x === 1 ) {

                    this.explosion[ i ].material.map.offset.y -= 0.25;

                } else if ( this.explosion[ i ].material.map.offset.x === 2 ) {

                    this.explosion[ i ].material.map.offset.y -= 0.25;

                } else if ( this.explosion[ i ].material.map.offset.x === 3 ) {

                    this.explosion[ i ].material.map.offset.y -= 0.25;
                    this.explosion[ i ].scale.x = Math.sin( this.explosion[ i ].time / 1000 );
                    this.explosion[ i ].scale.y = Math.sin( this.explosion[ i ].time / 1000 );
                    this.explosion[ i ].visible = false;

                }

            }

        }

    }

};

Game.Player.prototype.hideExplosion = function () {

    if ( ! this.explosion ) return;

    for ( var i = 0; i < this.explosion.length; i ++ ) {

        this.explosion[ i ].visible = false;

    }

};

Game.Player.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'ArenaPlayerRespawn', function ( event ) { scope.respawn( true, event.data.player ); });

    this.addEventListener( 'PlayerTankRotateTop', function ( event ) { scope.rotateTop( event.data[1] / 1000 ); });
    this.addEventListener( 'PlayerTankMove', function ( event ) { scope.move( event.data[1], event.data[2], event.data[3], event.data[4], event.data[5] ); });
    this.addEventListener( 'PlayerTankShoot', function ( event ) { scope.shoot( event.data[1] ); });
    this.addEventListener( 'PlayerTankHit', function ( event ) { scope.updateHealth( event.data[1] ); });
    this.addEventListener( 'PlayerTankDied', function ( event ) { scope.die( event.data[1] ); });
    this.addEventListener( 'PlayerGotBox', function ( event ) { scope.gotBox( event.data ); });

    this.addEventListener( 'BulletHit', function ( event ) { scope.bulletHit( event.data ); });

};
