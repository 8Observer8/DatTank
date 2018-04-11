/*
 * @author ohmed
 * DatTank Player object
*/

Game.Player = function ( arena, params ) {

    EventDispatcher.call( this );

    this.team = arena.teamManager.getById( params.team ) || false;

};

Game.Player.prototype.init = function ( params ) {

    this.tank.init();
    this.tank.setRotation( this.rotation );
    this.tank.setPosition( this.position.x, this.position.y, this.position.z );
    this.tank.updateLabel();

    this.addEventListeners();

};

Game.Player.prototype.respawn = function ( fromNetwork, params ) {

    this.position.set( params.position.x, params.position.y, params.position.z );
    this.rotation = params.rotation;
    this.rotationCorrection = 0;
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
    this.tank.updateLabel();

    if ( Game.arena.me.id === this.id ) {

        ui.updateHealth( this.health );
        ui.updateAmmo( this.ammo );
        ui.hideContinueBox();

    }

};

Game.Player.prototype.updateDirectionMovement = function ( time, delta ) {

    if ( this.status !== Game.Player.Alive ) return;
    var player = this;

    //

    if ( player.moveDirection.x !== 0 || player.moveDirection.y !== 0 ) {

        if ( player.tank.sounds.moving.buffer && ! player.tank.sounds.moving.isPlaying ) {

            player.tank.sounds.moving.play();
            player.tank.sounds.moving.isPlaying = true;

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

Game.Player.prototype.shoot = function ( bulletId ) {

    var scope = this;

    if ( this.status !== Game.Player.Alive ) return;

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
        element.css( 'animation-duration', 1.2 * 1000 * 60 / this.tank.rpm + 'ms' );

    }

};

Game.Player.prototype.updateHealth = function ( health, killerId ) {

    if ( this.status !== Game.Player.Alive ) return;

    health = ( health !== undefined ) ? health : this.health;

    this.tank.addHealthChangeLabel( health - this.health );

    //

    if ( Game.arena && Game.arena.me.id === this.id ) {

        if ( health < this.health ) {

            view.addCameraShake( 300, 3 );

        }

        ui.updateHealth( health );

    }

    //

    this.health = health;

    this.tank.updateLabel();

    if ( this.health === 0 ) {

        this.die( killerId );

    } else if ( this.health <= 50 ) {

        this.tank.showSmoke();

    } else {

        this.tank.hideSmoke();

    }

};

Game.Player.prototype.updateAmmo = function ( value ) {

    if ( this.status !== Game.Player.Alive ) return;

    this.ammo = value;
    ui.updateAmmo( this.ammo );

};

Game.Player.prototype.die = function ( killerId ) {

    if ( this.status !== Game.Player.Alive ) return;

    var scope = this;
    var killer = Game.arena.playerManager.getById( killerId ) || Game.arena.towerManager.getById( killerId );

    this.status = Game.Player.Dead;

    if ( killer && Game.arena.me.id === killer.id ) {

        game.logger.newEvent( 'kill' );

    }

    if ( this.id === Game.arena.me.id ) {

        view.addCameraShake( 1000, 1.5 );

        setTimeout( function () {

            if ( killer instanceof Game.Tower ) {

                ui.showContinueBox( '<br>' + killer.team.name + ' team tower', killer.team.color );

            } else if ( killer instanceof Game.Player ) {

                ui.showContinueBox( killer.login, killer.team.color );

            } else {

                ui.showContinueBox( '<br>stray bullet', '#555' );

            }

            scope.tank.object.visible = false;

        }, 1400 );

        controls.stopShooting();

    }

    if ( killer ) {

        ui.showKills( killer, this );

    }

    this.moveDirection.x = 0;
    this.moveDirection.y = 0;

    this.tank.destroy();

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

Game.Player.prototype.newLevel = function ( bonusLevels ) {

    setTimeout( function () {
    
        ui.showTankStatsUpdate( bonusLevels );

    }, 3000 );

    this.bonusLevels = bonusLevels;

};

Game.Player.prototype.updateStats = function ( name ) {

    var stats = {
        'speed':          0,
        'rpm':            1,
        'armour':         2,
        'gun':            3,
        'ammo-capacity':  4
    };

    switch ( name ) {

        case 'speed':

            this.tank.speed += 3;
            this.moveSpeed = this.originalMoveSpeed * this.tank.speed / 40;
            break;

        case 'rpm':

            this.tank.rpm *= 1.1;
            break;

        case 'armour':

            this.tank.armour += 10;
            break;

        case 'gun':

            this.tank.bullet += 5;
            break;

        case 'ammo-capacity':

            this.tank.ammoCapacity += 15;
            break;

        default:

            return false;

    }

    //

    var buffer = new ArrayBuffer( 4 );
    var bufferView = new Int16Array( buffer );
    var statsId = stats[ name ];

    //

    bufferView[1] = statsId;

    network.send( 'PlayerTankUpdateStats', buffer, bufferView );

};

//

Game.Player.prototype.update = function ( time, delta ) {

    var dx = this.positionCorrection.x * delta / 300;
    var dz = this.positionCorrection.z * delta / 300;
    var dr = this.rotationCorrection * delta / 100;

    if ( Math.abs( dr ) > 0.001 ) {

        this.rotationCorrection -= dr;
        this.rotation += dr;
        this.tank.setRotation( this.rotation );

    }

    if ( Math.abs( dx ) > 0.1 || Math.abs( dz ) > 0.1 ) {

        this.positionCorrection.x -= dx;
        this.positionCorrection.z -= dz;

        this.position.x += dx;
        this.position.z += dz;

    }

    //

    var x, z;
    var dx, dz;

    for ( var bulletId in this.tank.bullets ) {

        var bullet = this.tank.bullets[ bulletId ];

        if ( bullet.visible === true ) {

            x = bullet.position.x + this.bulletSpeed * Math.cos( bullet.directionRotation ) * delta;
            z = bullet.position.z + this.bulletSpeed * Math.sin( bullet.directionRotation ) * delta;
            bullet.position.set( x, bullet.position.y, z );

            bullet.trace.position.set( ( x + bullet.startPos.x ) / 2, bullet.position.y, ( z + bullet.startPos.z ) / 2 );
            dx = x - bullet.startPos.x;
            dz = z - bullet.startPos.z;
            bullet.trace.scale.x = Math.sqrt( dx * dx + dz * dz ) / 3;
            bullet.trace.material.opacity = Math.max( 0.5 - bullet.trace.scale.x / 280, 0 );

        }

    }

};

//

Game.Player.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'ArenaPlayerRespawn', function ( event ) { scope.respawn( true, event.data.player ); });
    this.addEventListener( 'PlayerNewLevel', function ( event ) { scope.newLevel( event.data[1] ); });

};
