
Game.Player.prototype.shoot = function ( bulletId ) {

    this.tank.showBlastSmoke();
    this.tank.shootBullet( bulletId );

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

Game.Player.prototype.update = function ( time, delta ) {

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
