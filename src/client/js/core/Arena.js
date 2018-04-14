/*
 * @author ohmed
 * DatTank Arena object
*/

Game.Arena.prototype.initExplosions = function () {

    for ( var i = 0; i < 30; i ++ ) {

        var map = resourceManager.getTexture( 'explosion2.png' ).clone();
        map.needsUpdate = true;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( 0.25, 0.25 );
        map.offset.set( 0, 0.75 );

        var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, opacity: 0.7, fog: true });
        var sprite = new THREE.Sprite( material );

        sprite.scale.set( 80, 80, 80 );
        sprite.visible = false;
        view.scene.add( sprite );
        this.effects.explosions.push( sprite );

    }

};

Game.Arena.prototype.showExplosion = function ( data ) {

    var bulletId = data[0];
    var ownerId = data[1];
    var position = { x: data[2], y: 25, z: data[3] };

    //

    for ( var i = 0; i < this.effects.explosions.length; i ++ ) {

        var explosion = this.effects.explosions[ i ];

        if ( ! explosion.visible ) {

            explosion.position.set( position.x, position.y, position.z );
            explosion.scale.set( 80, 80, 80 );
            explosion.visible = true;

            var shooter = this.playerManager.getById( ownerId );
            if ( shooter ) {

                shooter = shooter.tank;

            } else {

                shooter = this.towerManager.getById( ownerId );

            }

            if ( shooter ) {

                var bulletsPool = shooter.bullets;
                for ( var j = 0, jl = bulletsPool.length; j < jl; j ++ ) {

                    if ( bulletsPool[ j ].bulletId === bulletId ) {

                        bulletsPool[ j ].visible = false;
                        bulletsPool[ j ].trace.visible = false;
                        break;

                    }

                }

            }

            break;

        }

    }

};

Game.Arena.prototype.updateExplosions = function ( delta ) {

    for ( var i = 0; i < this.effects.explosions.length; i ++ ) {

        var explosion = this.effects.explosions[ i ];

        if ( ! explosion.visible ) continue;
        explosion.time = explosion.time || 0;
        explosion.time += delta;

        if ( explosion.time > 50 ) {

            if ( explosion.material.map.offset.y >= 0 ) {

                explosion.material.map.offset.x += 0.25;
                explosion.time = 0;

                if ( explosion.material.map.offset.x === 1 && explosion.material.map.offset.y !== 0 ) {

                    explosion.material.map.offset.x = 0;
                    explosion.material.map.offset.y -= 0.25;

                } else if ( explosion.material.map.offset.y === 0 && explosion.material.map.offset.x === 1 ) {

                    explosion.scale.x = 80;
                    explosion.scale.y = 80;
                    explosion.visible = false;
                    explosion.time = 0;
                    explosion.material.map.offset.set( 0, 1 );

                }

            }

        }

    }

};

Game.Arena.prototype.update = function ( time, delta ) {

    if ( this.stopped ) return;

    this.updateExplosions( delta );

    //

    for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

        this.playerManager.players[ i ].update( time, delta );

    }

    // remove out of range players

    var playersToRemove = [];

    for ( var i = 0, il = this.playerManager.players.length; i < il; i ++ ) {

        var player = this.playerManager.players[ i ];

        if ( ! player || player.id === this.me.id ) continue;
        if ( Utils.getDistance( player.position, this.me.position ) > this.viewRange ) {

            playersToRemove.push( player );

        }

    }

    for ( var i = 0, il = playersToRemove.length; i < il; i ++ ) {

        this.playerManager.remove( playersToRemove[ i ] );

    }

    // remove out of range towers

    var towersToRemove = [];

    for ( var i = 0, il = this.towerManager.towers.length; i < il; i ++ ) {

        var tower = this.towerManager.towers[ i ];
        if ( ! tower ) continue;

        if ( Utils.getDistance( tower.position, this.me.position ) > this.viewRange ) {

            towersToRemove.push( tower );

        }

    }

    for ( var i = 0, il = towersToRemove.length; i < il; i ++ ) {

        this.towerManager.remove( towersToRemove[ i ] );

    }

    // remove out of range boxes

    var boxesToRemove = [];

    for ( var i = 0, il = this.boxManager.boxes.length; i < il; i ++ ) {

        var box = this.boxManager.boxes[ i ];
        if ( ! box ) continue;

        if ( Utils.getDistance( box.position, this.me.position ) > this.viewRange ) {

            boxesToRemove.push( box );

        }

    }

    for ( var i = 0, il = boxesToRemove.length; i < il; i ++ ) {

        this.boxManager.remove( boxesToRemove[ i ] );

    }

};
