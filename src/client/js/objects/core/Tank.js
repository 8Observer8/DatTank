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

    this.label = false;
    this.ffLabel = false;
    this.healthChangeLabels = [];

    //

    this.type = 'tank';
    this.name = false;

};

Game.Tank.prototype = {};

//

Game.Tank.prototype.init = function () {

    this.initModel();
    this.initBullets();
    this.initSounds();
    this.initTracks();
    this.initLabel();

    //

    if ( this.player.health <= 0 ) {

        this.destroy();

    }

};

Game.Tank.prototype.initBullets = function () {

    for ( var i = 0; i < 5; i ++ ) {

        var bullet = new THREE.Mesh( new THREE.BoxGeometry( 2.5, 2.5, 2.5 ), new THREE.MeshBasicMaterial({ color: 0xff3333 }) );
        bullet.visible = false;
        this.bullets.push( bullet );
        view.scene.add( bullet );

        var bulletTrace = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true }) );
        bulletTrace.visible = false;
        bulletTrace.rotation.x = - Math.PI / 2;
        view.scene.add( bulletTrace );
        bullet.trace = bulletTrace;
        bullet.trace.renderOrder = 5;

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

        plane1.renderOrder = 3;
        plane2.renderOrder = 3;

        view.scene.add( plane1 );
        view.scene.add( plane2 );

    }

};

Game.Tank.prototype.initSounds = function () {

    this.sounds.moving = new THREE.PositionalAudio( view.sound.listener );
    this.sounds.moving.setBuffer( resourceManager.getSound('tank_moving.wav') );
    this.sounds.moving.loop = true;
    this.sounds.moving.setRefDistance( 11 );
    this.sounds.moving.autoplay = false;
    if ( this.player.id !== Game.arena.me ) this.sounds.moving.setVolume(0.15);

    this.object.add( this.sounds.moving );

    this.sounds.explosion = new THREE.PositionalAudio( view.sound.listener );
    this.sounds.explosion.setBuffer( resourceManager.getSound('tank_explosion.wav') );
    this.sounds.explosion.loop = false;
    this.sounds.explosion.setRefDistance( 15 );
    this.sounds.explosion.autoplay = false;
    if ( this.player.id !== Game.arena.me ) this.sounds.explosion.setVolume(0.4);

    this.object.add( this.sounds.explosion );

};

Game.Tank.prototype.initLabel = function () {

    var canvas, ctx, sprite, material;
    this.label = {};

    canvas = document.createElement( 'canvas' );
    canvas.width = 256;
    canvas.height = 64;

    ctx = canvas.getContext('2d');
    material = new THREE.SpriteMaterial({ map: new THREE.Texture( canvas ), color: 0xffffff, fog: true });

    sprite = new THREE.Sprite( material );
    sprite.position.set( 0, 35, 0 );
    sprite.scale.set( 52, 13, 1 );

    this.label.canvas = canvas;
    this.label.ctx = ctx;
    this.label.material = material;
    this.label.sprite = sprite;

    this.object.add( sprite );

};

Game.Tank.prototype.updateLabel = function () {

    var width = this.label.canvas.width;

    //

    this.label.ctx.shadowColor = '#000';
    this.label.ctx.shadowOffsetX = 0;
    this.label.ctx.shadowOffsetY = 0;
    this.label.ctx.shadowBlur = 3;

    // draw health red bg

    this.label.ctx.fillStyle = '#9e0e0e';
    this.label.ctx.fillRect( 0, 0, 300, 10 );

    // draw health green indicator

    this.label.ctx.fillStyle = '#00ff00';
    this.label.ctx.fillRect( 0, 0, width * ( this.player.health / 100 ), 10 );

    // draw health 'amout' lines based on armour

    this.label.ctx.strokeStyle = 'rgba( 0, 0, 0, 0.3 )';

    for ( var i = 0, il = 3 * this.armour / 50; i < il; i ++ ) {

        this.label.ctx.beginPath();
        this.label.ctx.moveTo( i * width / il, 0 );
        this.label.ctx.lineTo( i * width / il, 10 );
        this.label.ctx.stroke();

    }

    // draw team color rect

    this.label.ctx.fillStyle = this.player.team.color;
    this.label.ctx.fillRect( 0, 15, 25, 25 );

    // draw player login

    this.label.ctx.fillStyle = '#ffffff';
    this.label.ctx.font = '26px Tahoma';
    this.label.ctx.textAlign = 'left';

    this.label.ctx.fillText( this.player.login, 30, 35 );

    this.label.material.map.needsUpdate = true;

};

Game.Tank.prototype.addHealthChangeLabel = function ( delta ) {

    var canvas, ctx, sprite, material;
    var text = ( delta >= 0 ) ? '+' + Math.round( delta ) : Math.round( delta );
    var color = ( delta >= 0 ) ? '#00ff00' : '#ff0000';

    canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 64;

    ctx = canvas.getContext('2d');

    ctx.shadowColor = '#000';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 3;

    ctx.fillStyle = color;
    ctx.font = '35px Tahoma';
    ctx.textAlign = 'left';
    ctx.fillText( text, 30, 35 );

    material = new THREE.SpriteMaterial({ map: new THREE.Texture( canvas ), color: 0xffffff, fog: true });
    material.map.needsUpdate = true;

    sprite = new THREE.Sprite( material );
    sprite.position.set( 0, 35, 0 );
    sprite.scale.set( 24, 12, 1 );
    sprite.time = 0;

    this.object.add( sprite );

    this.healthChangeLabels.push( sprite );

};

Game.Tank.prototype.friendlyFire = function () {

    if ( ! this.ffLabel ) {

        var canvas, ctx, sprite, material;
        this.ffLabel = {};

        canvas = document.createElement( 'canvas' );
        canvas.width = 256;
        canvas.height = 32;

        ctx = canvas.getContext('2d');

        // draw lebel text

        ctx.fillStyle = '#fff';
        ctx.font = '26px Tahoma';
        ctx.textAlign = 'left';
        ctx.shadowColor = '#900';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 3;
        ctx.fillText( 'Friendly fire!!!', 55, 20 );

        // make sprite

        material = new THREE.SpriteMaterial({ map: new THREE.Texture( canvas ), color: 0xffffff, fog: true });
        material.map.needsUpdate = true;

        sprite = new THREE.Sprite( material );
        sprite.position.set( 0, 45, 0 );
        sprite.scale.set( 52, 6.2, 1 );
        sprite.visible = false;

        this.ffLabel.canvas = canvas;
        this.ffLabel.ctx = ctx;
        this.ffLabel.material = material;
        this.ffLabel.sprite = sprite;

        this.object.add( sprite );

    }

    //

    this.ffLabel.sprite.visible = true;
    this.ffLabel.sprite.material.opacity = 0.0;
    this.ffLabel.sprite.position.y = 45;
    this.ffLabel.time = 0;

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

    for ( var i = 0, il = this.bullets.length; i < il; i ++ ) {

        this.bullets[ i ].visible = false;

    }

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
        plane1.position.x += ( dist - this.trackOffset.l ) * Math.cos( - rotation );
        plane1.position.z += ( dist - this.trackOffset.l ) * Math.sin( - rotation );
        plane1.position.y = 2.2;

        plane2.rotation.x = - Math.PI / 2;
        plane2.position.copy( position );
        plane2.rotation.z = rotation;
        plane2.position.x -= ( dist - 5 - this.trackOffset.r ) * Math.cos( - rotation );
        plane2.position.z -= ( dist - 5 - this.trackOffset.r ) * Math.sin( - rotation );
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

        var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true });
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
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true, transparent: true } );
    var sprite = new THREE.Sprite( material );
    var scale;

    this.effects.smoke = [];
    material.depthTest = true;
    material.depthWrite = false;

    for ( var i = 0; i <= 5; i ++ ) {

        sprite = sprite.clone();
        sprite.position.z = -15;
        sprite.position.y = 7 * i;
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

Game.Tank.prototype.shootBullet = function ( bulletId ) {

    var bullet = false;

    for ( var i = 0, il = this.bullets.length; i < il; i ++ ) {

        bullet = this.bullets[ i ];
        bullet.bulletId = bulletId;
        if ( bullet.visible === false ) break;

    }

    //

    this.animations.shotAction.stop();
    this.animations.shotAction.play();

    //

    bullet.visible = true;
    bullet.trace.visible = true;
    bullet.directionRotation = - this.object.top.rotation.y - this.object.rotation.y;

    var offsetDist = 28;
    var offsetX = offsetDist * Math.cos( bullet.directionRotation );
    var offsetZ = offsetDist * Math.sin( bullet.directionRotation );

    bullet.startPos = new THREE.Vector3( this.object.position.x + offsetX, 25, this.object.position.z + offsetZ );
    bullet.position.set( this.object.position.x + offsetX, 25, this.object.position.z + offsetZ );
    bullet.trace.position.set( this.object.position.x + offsetX, 25, this.object.position.z + offsetZ );
    bullet.trace.rotation.z = - bullet.directionRotation;
    bullet.trace.scale.set( 1, 1, 1 );

    if ( bullet.soundShooting.buffer ) {

        if ( bullet.soundShooting.isPlaying ) {

            bullet.soundShooting.stop();
            bullet.soundShooting.startTime = 0;
            bullet.soundShooting.isPlaying = false;

        }

        bullet.soundShooting.play();

    }

};

Game.Tank.prototype.dispose = function () {

    // stop all audio

    for ( var s in this.sounds ) {

        if ( this.sounds[ s ] ) this.sounds[ s ].pause();

    }

    // remove explosion objects from scene

    if ( this.effects.explosion ) {

        for ( var i = 0, il = this.effects.explosion.length; i < il; i ++ ) {

            view.scene.remove( this.effects.explosion[ i ] );

        }

    }

    // remove smoke objects from scene

    if ( this.effects.blastSmoke ) {

        for ( var i = 0, il = this.effects.blastSmoke.length; i < il; i ++ ) {

            view.scene.remove( this.effects.blastSmoke[ i ] );

        }

    }

    // remove bullets from scene

    for ( var i = 0, il = this.bullets.length; i < il; i ++ ) {

        view.scene.remove( this.bullets[ i ] );
        view.scene.remove( this.bullets[ i ].trace );

    }

    // remove tracks from scene

    for ( var i = 0, il = this.tracks.length; i < il; i ++ ) {

        view.scene.remove( this.tracks[ i ].left );
        view.scene.remove( this.tracks[ i ].right );

    }

    // remove tank object from scene

    view.scene.remove( this.object );

};

Game.Tank.prototype.animate = function ( delta ) {

    var newHealthChangeLabelsList = [];
    var visibleTime = 1000;

    for ( var i = 0, il = this.healthChangeLabels.length; i < il; i ++ ) {

        this.healthChangeLabels[ i ].time += delta;
        this.healthChangeLabels[ i ].position.y = 45 + 50 * this.healthChangeLabels[ i ].time / visibleTime;

        if ( this.healthChangeLabels[ i ].time > visibleTime / 4 ) {

            this.healthChangeLabels[ i ].material.opacity = 0.5 - ( this.healthChangeLabels[ i ].time - visibleTime / 4 ) / ( 3 * visibleTime / 4 );

        }

        if ( this.healthChangeLabels[ i ].time > visibleTime ) {

            this.object.remove( this.healthChangeLabels[ i ] );

        } else {

            newHealthChangeLabelsList.push( this.healthChangeLabels[ i ] );

        }

    }

    this.healthChangeLabels = newHealthChangeLabelsList;

    //

    if ( this.ffLabel && this.ffLabel.sprite.visible ) {

        this.ffLabel.time += delta;
        this.ffLabel.sprite.position.y = 45 + 20 * this.ffLabel.time / 3000;

        if ( this.ffLabel.time < 1500 ) {

            this.ffLabel.sprite.material.opacity = this.ffLabel.time / 1500;

        } else if ( this.ffLabel.time < 3000 ) {

            this.ffLabel.sprite.material.opacity = 2 - this.ffLabel.time / 1500;

        } else {

            this.ffLabel.sprite.visible = false;

        }

    }

    if ( this.mixer ) {

        this.mixer.update( delta / 1000 );

    }

};

Game.Tank.prototype.update = function ( delta ) {

    this.updateSmoke();
    this.updateBlastSmoke();
    this.updateTracks();
    this.updateExplosion( delta );
    this.animate( delta );

};

Game.Tank.list = {};
Game.Tank.numID = 0;
