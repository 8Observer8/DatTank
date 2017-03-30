/*
 * @author ohmed
 * Tank unit general class
*/

Game.Tank = function ( params ) {

    params = params || {};

    this.id = Game.Tank.numID ++;
    this.player = params.player;

    this.animations = {};
    this.effects = {};
    this.sounds = {};
    this.bullets = [];
    this.object = false;

    //

    this.blastSmokeEnabled = false;
    this.smokeEnabled = false;

    //

    this.prevPosition = new THREE.Vector3();
    this.tracksOffset = 0;
    this.tracks = [];

    //

    this.type = 'tank';
    this.name = false;

};

Game.Tank.prototype = {};

Game.Tank.prototype.init = function () {

    this.initModel();
    this.initBullets();
    this.initSounds();
    this.initTracks();
    this.initLabel();

};

Game.Tank.prototype.initBullets = function () {

    for ( var i = 0; i < 5; i ++ ) {

        //var bullet = new THREE.Mesh( new THREE.BoxGeometry( 2, 2, 2 ), new THREE.MeshLambertMaterial({ color: 0xff0000 }) );
        var bullet = new THREE.Mesh( new THREE.SphereGeometry( 2.5, 12, 12 ), new THREE.MeshLambertMaterial({ color: this.player.team.color }) );
        bullet.visible = false;
        
        bullet.active = false;

        this.bullets.push( bullet );
        view.scene.add( bullet );

        bullet.soundShooting = new THREE.PositionalAudio( view.sound.listener );
        bullet.soundShooting.setBuffer( resourceManager.getSound('tank_shooting.wav') );
        bullet.soundShooting.loop = false;
        bullet.soundShooting.setRefDistance( 30 );
        bullet.soundShooting.autoplay = false;

        if ( this.player.id !== Game.arena.me ) bullet.soundShooting.setVolume(0.4);

        this.object.add( bullet.soundShooting );

    }

};

Game.Tank.prototype.initTracks = function () {

    var material;
    var plane1, plane2;

    for ( var i = 0; i < 35; i ++ ) {

        material = new THREE.MeshBasicMaterial({ color: 0x140a00, transparent: true, opacity: 0.7, depthWrite: false });
        plane1 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 6, 2 ), material );
        plane2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 6, 2 ), material );
        this.tracks.push({
            left: plane1,
            right: plane2,
            material: material,
            position: new THREE.Vector3(),
            lastUpdate: 0
        });

        view.scene.add( plane1 );
        view.scene.add( plane2 );

    }

};

Game.Tank.prototype.initSounds = function () {

    this.sounds.moving = new THREE.PositionalAudio( view.sound.listener );
    this.sounds.moving.setBuffer( resourceManager.getSound('tank_moving.wav') );
    this.sounds.moving.loop = true;
    this.sounds.moving.setRefDistance( 15 );
    this.sounds.moving.autoplay = false;
    if ( this.player.id !== Game.arena.me ) this.sounds.moving.setVolume(0.4);

    this.object.add( this.sounds.moving );

    this.sounds.explosion = new THREE.PositionalAudio( view.sound.listener );
    this.sounds.explosion.setBuffer( resourceManager.getSound('tank_explosion.wav') );
    this.sounds.explosion.loop = true;
    this.sounds.explosion.setRefDistance( 15 );
    this.sounds.explosion.autoplay = false;
    if ( this.player.id !== Game.arena.me ) this.sounds.explosion.setVolume(0.4);

    this.object.add( this.sounds.explosion );

};

Game.Tank.prototype.initLabel = function () {

    var canvas = document.createElement( 'canvas' );
    canvas.width = 30 + 20 * this.player.login.length;
    canvas.height = 25;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = this.player.team.color;
    ctx.fillRect( 0, 0, 25, 25 );

    ctx.fillStyle = '#ffffff';
    ctx.font = '25px Arial';
    ctx.textAlign = 'left';
    ctx.fillText( this.player.login, 30, 20 );

    //

    var material = new THREE.SpriteMaterial({ map: new THREE.Texture( canvas ), color: 0xffffff });
    material.map.needsUpdate = true;

    var sprite = new THREE.Sprite( material );
    sprite.position.set( 0, 50, 0 );
    sprite.scale.set( canvas.width / 3, canvas.height / 3, 1 );
    material.depthWrite = false;
    material.depthTest = false;
    this.object.add( sprite );

};

Game.Tank.prototype.reset = function () {

    this.animations.deathAction1.stop();
    this.animations.deathAction2.stop();
    this.animations.shotAction.stop();

    this.object.visible = true;
    this.object.rotation.y = 0;

    this.hideSmoke();
    this.hideExplosion();
    this.hideBlastSmoke();

};

Game.Tank.prototype.addTrack = function () {

    var rotation = this.object.rotation.y;
    var position = this.object.position;

    if ( Math.sqrt( Math.pow( this.prevPosition.x - position.x, 2 ) + Math.pow( this.prevPosition.z - position.z, 2 ) ) > 4 ) {

        var dist = 12;
        var plane1, plane2;

        var track = this.tracks[ this.tracksOffset ];
        plane1 = track.left;
        plane2 = track.right;

        track.lastUpdate = Date.now();

        plane1.rotation.x = - Math.PI / 2;
        plane1.rotation.z = rotation;
        plane1.position.copy( position );
        plane1.position.x += dist * Math.cos( - rotation );
        plane1.position.z += dist * Math.sin( - rotation );
        plane1.position.y = 2.2;

        plane2.rotation.x = - Math.PI / 2;
        plane2.position.copy( position );
        plane2.rotation.z = rotation;
        plane2.position.x -= ( dist - 5 ) * Math.cos( - rotation );
        plane2.position.z -= ( dist - 5 ) * Math.sin( - rotation );
        plane2.position.y = 2.2;

        track.position.copy( position );

        this.prevPosition.x = position.x;
        this.prevPosition.z = position.z;

        this.tracksOffset ++;
        if ( this.tracksOffset === 35 ) this.tracksOffset = 0;

    }

};

Game.Tank.prototype.updateTracks = function () {

    for ( var i = 0; i < this.tracks.length; i ++ ) {

        this.tracks[ i ].material.opacity = 1 - Math.min( Date.now() - this.tracks[ i ].lastUpdate, 2300 ) / 2300;

    }

};

Game.Tank.prototype.setRotation = function ( angle ) {

    this.object.rotation.y = angle;

};

Game.Tank.prototype.setTopRotation = function ( angle ) {

    this.object.top.rotation.y = angle;

};

Game.Tank.prototype.setPosition = function ( x, y, z ) {

    this.object.position.set( x, y, z );

};

Game.Tank.prototype.hideBlastSmoke = function () {

    if ( ! this.effects.blastSmoke ) return;

    this.blastSmokeEnabled = false;

    for ( var i = 0; i < this.effects.blastSmoke.length; i ++ ) {

        this.effects.blastSmoke[ i ].opacity = 0;

    }

};

Game.Tank.prototype.updateBlastSmoke = function () {

    if ( ! this.blastSmokeEnabled || ! this.effects.blastSmoke ) return;

    var sprite, scale;

    var enabled = false;

    for ( var i = 0, il = this.effects.blastSmoke.length; i < il; i ++ ) {

        sprite = this.effects.blastSmoke[ i ];

        scale = sprite.scale.x + 0.05;
        sprite.material.opacity -= 0.8 / 20;

        if ( sprite.material.opacity >= 0 ) {

            enabled = true;

        }

        sprite.scale.set( scale, scale, scale );

    }

    if ( ! enabled ) {

        this.blastSmokeEnabled = false;

    }

};

Game.Tank.prototype.showExplosion = function () {

    var scale;

    this.effects.explosion = [];

    for ( var i = 0; i < 1; i ++ ) {

        var map = resourceManager.getTexture( 'explosion1.png' ).clone();
        map.needsUpdate = true;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( 0.2, 0.25 );
        map.offset.set( 0, 0.75 );

        var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
        var sprite = new THREE.Sprite( material );

        sprite.position.z = -15;
        sprite.position.y = 30 + 7 * i;
        sprite.position.x = Math.random() * 3 - 1.5;
        sprite.material = sprite.material.clone();
        sprite.material.opacity = 0.8 - 0.8/5 * i;
        scale = 80;
        sprite.scale.set( scale, scale, scale );
        sprite.visible = true;
        this.object.add( sprite );        
        this.effects.explosion.push( sprite );

    }

};

Game.Tank.prototype.updateExplosion = function ( delta ) {

    if ( ! this.effects.explosion ) return;

    for ( var i = 0, il = this.effects.explosion.length; i < il; i ++ ) {

        this.effects.explosion[ i ].material.time = this.effects.explosion[ i ].material.time || 0;
        this.effects.explosion[ i ].material.time += delta;

        if ( this.effects.explosion[ i ].material.time > 50 ) {

            if ( this.effects.explosion[0].material.map.offset.y > 0 ) {        
            
                this.effects.explosion[ i ].material.map.offset.x += 0.2;
                this.effects.explosion[ i ].material.time = 0;

            } else {

                this.effects.explosion[ i ].scale.x = 30 + 3 * Math.sin( this.effects.explosion[ i ].material.time / 1000 );
                this.effects.explosion[ i ].scale.y = 30 + 3 * Math.sin( this.effects.explosion[ i ].material.time / 1000 );

                if ( this.effects.explosion[ i ].material.time % 100 === 0 ) {

                    this.effects.explosion[ i ].material.map.offset.x += 0.2;
                    if ( this.effects.explosion[ i ].material.map.offset.x === 1 ) {

                        this.effects.explosion[ i ].material.map.offset.x = 0.2;

                    }

                }

                return;

            }

            if ( this.effects.explosion[ i ].material.map.offset.x === 1 ) {

                if ( this.effects.explosion[0].material.map.offset.y > 0 ) {
                
                    this.effects.explosion[ i ].material.map.offset.x = 0;
                    this.effects.explosion[ i ].material.map.offset.y -= 0.25;

                    this.effects.explosion[ i ].scale.x += 0.4;
                    this.effects.explosion[ i ].scale.y += 0.4;

                }

                if ( this.effects.explosion[ i ].material.map.offset.y === 0.5 ) {

                    this.showSmoke( 1.2 );

                }

            }

        }

    }

};

Game.Tank.prototype.hideExplosion = function () {

    if ( ! this.effects.explosion ) return;

    for ( var i = 0; i < this.effects.explosion.length; i ++ ) {

        this.effects.explosion[ i ].visible = false;

    }

};

Game.Tank.prototype.showSmoke = function ( strength ) {

    strength = strength || 1;

    this.smokeEnabled = true;

    if ( this.effects.smoke ) {

        for ( var i = 0; i < this.effects.smoke.length; i ++ ) {

            this.effects.smoke[ i ].visible = true;

        }

        return;

    }

    var map = resourceManager.getTexture( 'smoke.png' );
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: false, transparent: true } );
    var sprite = new THREE.Sprite( material );
    var scale;

    this.effects.smoke = [];
    material.depthTest = false;
    material.depthWrite = false;

    for ( var i = 0; i <= 5; i ++ ) {

        sprite = sprite.clone();
        sprite.position.z = -15;
        sprite.position.y = 0 + 7 * i;
        sprite.position.x = Math.random() * 3 - 1.5;
        sprite.material = sprite.material.clone();
        sprite.material.opacity = 0.8 - 0.8/5 * i;
        scale = strength * ( 10 + Math.random() * 30 );
        sprite.scale.set( scale, scale, scale );
        sprite.visible = false;
        this.object.add( sprite );        
        this.effects.smoke.push( sprite );

    }

};

Game.Tank.prototype.hideSmoke = function () {

    if ( ! this.effects.smoke ) return;

    this.smokeEnabled = false;

    for ( var i = 0; i < this.effects.smoke.length; i ++ ) {

        this.effects.smoke[ i ].visible = false;

    }

};

Game.Tank.prototype.updateSmoke = function () {

    if ( ! this.smokeEnabled || ! this.effects.smoke ) return;

    var sprite, scale;

    for ( var i = 0, il = this.effects.smoke.length; i < il; i ++ ) {

        sprite = this.effects.smoke[ i ];

        sprite.position.z = - 15;
        sprite.position.y += 35 / 150;

        sprite.material.opacity -= 0.8 / 150;

        if ( sprite.material.opacity < 0 ) {

            sprite.material.opacity = 0.8;
            scale = 10 + Math.random() * 30;
            sprite.position.y = 35;
            sprite.visible = true;

        } else {

            scale = sprite.scale.x;
            scale += 30 / 150;

        }

        sprite.scale.set( scale, scale, scale );

    }

};

Game.Tank.prototype.shootBullet = function () {

    var bullet = false;
    var hitCallback = false;

    for ( var i = 0, il = this.bullets.length; i < il; i ++ ) {

        bullet = this.bullets[ i ];
        if ( bullet.active === false ) break;

    }

    //

    this.animations.shotAction.stop();
    this.animations.shotAction.play();

    //

    bullet.position.set( this.object.position.x, 25, this.object.position.z );
    bullet.active = true;
    bullet.flyTime = 0;

    if ( bullet.soundShooting.source.buffer ) {

        if ( bullet.soundShooting.isPlaying ) {

            bullet.soundShooting.stop();
            bullet.soundShooting.startTime = 0;
            bullet.soundShooting.isPlaying = false;

        }

        if ( localStorage.getItem('sound') !== 'false' ) {

            bullet.soundShooting.play();

        }

    }

    //

    var angle = - this.object.top.rotation.y - this.object.rotation.y;
    var direction = new THREE.Vector3( Math.cos( angle ), 0, Math.sin( angle ) ).normalize();

    view.raycaster.ray.direction.set( direction.x, direction.y, direction.z );
    view.raycaster.ray.origin.set( this.object.position.x, 22, this.object.position.z );

    var intersections = view.raycaster.intersectObjects( view.scene.intersections );

    bullet.shotInterval = setInterval( function () {

        for ( var j = 0; j < 10; j ++ ) {

            var x = bullet.position.x + Math.cos( angle ) * 0.4;
            var z = bullet.position.z + Math.sin( angle ) * 0.4;

            bullet.position.set( x, bullet.position.y, z );

            if ( intersections.length && intersections[ 0 ].object.name !== 'tank' && intersections[ 0 ].object.name !== 'tower' ) {

                if ( Utils.getDistance( bullet.position, intersections[ 0 ].point ) < 9 ) {

                    clearInterval( bullet.shotInterval );
                    bullet.visible = false;
                    bullet.active = false;
                    return;

                }

            }

            if ( ! ( intersections.length && ( intersections[ 0 ].object.name === 'tank' || intersections[ 0 ].object.name === 'tower' ) ) ) continue;

            if ( Utils.getDistance( bullet.position, intersections[ 0 ].point ) < 9 ) {

                if ( hitCallback ) {

                    hitCallback( intersections[ 0 ].object );

                }

                clearInterval( bullet.shotInterval );
                bullet.visible = false;
                bullet.active = false;
                return;

            }

        }

        bullet.flyTime ++;

        if ( bullet.flyTime > 15 ) {

            bullet.visible = true;

        }

        if ( bullet.flyTime > 500 ) {

            clearInterval( bullet.shotInterval );
            bullet.visible = false;
            bullet.active = false;

        }

    }, 3 );

    return {

        onHit: function ( callback ) {

            hitCallback = callback;

        }

    };

};

Game.Tank.prototype.updateBullets = function () {

    // todo

};

Game.Tank.prototype.setDamage = function () {

    // todo

};

Game.Tank.prototype.rotateTop = function () {

    // todo

};

Game.Tank.prototype.dispose = function () {

    // todo: dispose effects
    // todo: dispose bullets

    view.scene.remove( this.object );

};

Game.Tank.prototype.animate = function ( delta ) {

    if ( this.mixer ) {

        this.mixer.update( delta / 1000 );

    }

};

Game.Tank.prototype.update = function ( delta ) {

    this.updateSmoke();
    this.updateBlastSmoke();
    this.updateBullets();
    this.updateTracks();
    this.updateExplosion( delta );
    this.animate( delta );

};

Game.Tank.list = {};
Game.Tank.numID = 0;
