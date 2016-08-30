/*
 * @author ohmed
 * Tank unit general class
*/

DT.Tank = function ( params ) {

    params = params || {};

    this.id = DT.Tank.numID ++;
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

    this.type = 'tank';
    this.name = false;

};

DT.Tank.prototype = {};

DT.Tank.prototype.init = function () {

    this.initModel();
    this.initBullets();
    this.initSounds();
    this.initLabel();

};

DT.Tank.prototype.initModel = function () {

    this.object = new THREE.Object3D();

    var tankBaseModel = resourceManager.getModel( this.model.base );
    var tankTopModel = resourceManager.getModel( this.model.top );

    //

    var base = new THREE.Mesh( tankBaseModel.geometry, new THREE.MeshFaceMaterial( tankBaseModel.material ) );
    base.castShadow = true;
    base.rotation.y =  0;
    base.receiveShadow = true;
    base.scale.set( 20, 20, 20 );
    this.object.add( base );
    this.object.base = base;

    //

    var top = new THREE.Mesh( tankTopModel.geometry, new THREE.MeshFaceMaterial( tankTopModel.material ) );
    top.castShadow = true;
    top.receiveShadow = true;
    top.position.y = 20;
    top.scale.set( 20, 20, 20 );

    for ( var i = 0, il = top.material.materials.length; i < il; i ++ ) {

        top.material.materials[ i ].morphTargets = true;

    }

    this.object.add( top );

    //

    var box = new THREE.Mesh( new THREE.BoxGeometry( 30, 40, 60 ), new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 }) );
    box.position.y = 10;
    box.name = 'tank';
    box.owner = this.player;
    box.material.visible = false;
    this.object.add( box );
    view.scene.intersections.push( box );
    this.object.top = top;

    //

    this.mixer = new THREE.AnimationMixer( top );

    var morphTargets = top.geometry.morphTargets;

    var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'shot', [ morphTargets[0], morphTargets[1], morphTargets[2] ], 30 );
    clip.duration = 30;
    var shotAction = this.mixer.clipAction( clip );
    shotAction.loop = THREE.LoopOnce;
    shotAction.enabled = false;
    this.animations.shotAction = shotAction;

    var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'death', [ morphTargets[2], morphTargets[3], morphTargets[4] ], 10 );
    clip.duration = 10;
    var deathAction = this.mixer.clipAction( clip );
    deathAction.duration = clip.duration;
    deathAction.loop = THREE.LoopOnce;
    deathAction.enabled = false;
    this.animations.deathAction = shotAction;

    //

    view.scene.add( this.object );

};

DT.Tank.prototype.initBullets = function () {

    for ( var i = 0; i < 5; i ++ ) {

        var bullet = new THREE.Mesh( new THREE.BoxGeometry( 2, 2, 2 ), new THREE.MeshLambertMaterial({ color: 0xff0000 }) );
        bullet.visible = false;
        bullet.active = false;

        this.bullets.push( bullet );
        view.scene.add( bullet );

        bullet.soundShooting = new THREE.PositionalAudio( view.sound.listener );
        bullet.soundShooting.setBuffer( resourceManager.getSound('tank_shooting.wav') );
        bullet.soundShooting.loop = false;
        bullet.soundShooting.setRefDistance( 30 );
        bullet.soundShooting.autoplay = false;
        // bullet.soundShooting.setVolume( 0 );
        
        if ( localStorage.getItem('sound') === 'false' ) {
            bullet.soundShooting.setVolume( 0 );
        } else {
            bullet.soundShooting.setVolume( 1 );
        };

        this.object.add( bullet.soundShooting );

    }

};

DT.Tank.prototype.initSounds = function () {

    this.sounds.moving = new THREE.PositionalAudio( view.sound.listener );
    this.sounds.moving.setBuffer( resourceManager.getSound('tank_moving.wav') );
    this.sounds.moving.loop = true;
    this.sounds.moving.setRefDistance( 15 );
    this.sounds.moving.autoplay = false;
    // this.sounds.moving.setVolume( 0.3 );

    if ( localStorage.getItem('sound') === 'false' ) {
        this.sounds.moving.setVolume( 0 );
    } else {
        this.sounds.moving.setVolume( 0.3 );
    };

    this.object.add( this.sounds.moving );

    this.sounds.explosion = new THREE.PositionalAudio( view.sound.listener );
    this.sounds.explosion.setBuffer( resourceManager.getSound('tank_explosion.wav') );
    this.sounds.explosion.loop = true;
    this.sounds.explosion.setRefDistance( 15 );
    this.sounds.explosion.autoplay = false;
    // this.sounds.explosion.setVolume( 0.7 );

    if ( localStorage.getItem('sound') === 'false' ) {
        this.sounds.explosion.setVolume( 0 );
    } else {
        this.sounds.explosion.setVolume( 0.7 );
    };

    this.object.add( this.sounds.explosion );

};

DT.Tank.prototype.initLabel = function () {

    var canvas = document.createElement( 'canvas' );
    canvas.width = 30 + 20 * this.player.login.length;
    canvas.height = 25;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = DT.Team.colors[ this.player.team ];
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

DT.Tank.prototype.reset = function () {

    this.animations.shotAction.time = 0;
    this.animations.deathAction.time = 0;

    this.animations.deathAction.enabled = true;
    this.animations.shotAction.enabled = true;

    this.mixer.update(0);

    this.animations.deathAction.enabled = false;
    this.animations.shotAction.enabled = false;

    this.object.rotation.y = 0;

    this.hideSmoke();
    this.hideBlastSmoke();

};

DT.Tank.prototype.setRotation = function ( angle ) {

    this.object.rotation.y = angle;

};

DT.Tank.prototype.setTopRotation = function ( angle ) {

    this.object.top.rotation.y = angle;

};

DT.Tank.prototype.setPosition = function ( x, y, z ) {

    this.object.position.set( x, y, z );

};

DT.Tank.prototype.showBlastSmoke = function () {

    this.blastSmokeEnabled = true;

    var scale;
    var sprite;

    if ( this.effects.blastSmoke ) {

        for ( var i = 0; i < this.effects.blastSmoke.length; i ++ ) {

            sprite = this.effects.blastSmoke[ i ];
            scale = 1 + i / 5;

            sprite.scale.set( scale, scale, scale );
            sprite.material.opacity = 0.8 - 0.8 / 5 * ( 5 - i );
            sprite.visible = true;

        }

        return;

    }

    var map = resourceManager.getTexture( 'smoke.png' );
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: false, transparent: true } );
    var sprite = new THREE.Sprite( material );

    this.effects.blastSmoke = [];
    material.depthTest = false;
    material.depthWrite = false;

    for ( var i = 0; i <= 5; i ++ ) {
        
        sprite = sprite.clone();
        sprite.position.z = 0;
        sprite.position.y = 0;
        sprite.position.x = 2.9 + i / 7;
        sprite.material = sprite.material.clone();
        sprite.material.opacity = 0.8 - 0.8 / 5 * ( 5 - i );
        scale = 1 + i / 5;
        sprite.scale.set( scale, scale, scale );
        this.object.top.add( sprite );        
        this.effects.blastSmoke.push( sprite );

    }

};

DT.Tank.prototype.hideBlastSmoke = function () {

    if ( ! this.effects.blastSmoke ) return;

    this.blastSmokeEnabled = false;

    for ( var i = 0; i < this.effects.blastSmoke.length; i ++ ) {

        this.effects.blastSmoke[ i ].opacity = 0;

    }

};

DT.Tank.prototype.updateBlastSmoke = function () {

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

DT.Tank.prototype.showSmoke = function () {

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
        scale = 10 + Math.random() * 30;
        sprite.scale.set( scale, scale, scale );
        sprite.visible = false;
        this.object.add( sprite );        
        this.effects.smoke.push( sprite );

    }

};

DT.Tank.prototype.hideSmoke = function () {

    if ( ! this.effects.smoke ) return;

    this.smokeEnabled = false;

    for ( var i = 0; i < this.effects.smoke.length; i ++ ) {

        this.effects.smoke[ i ].visible = false;

    }

};

DT.Tank.prototype.updateSmoke = function () {

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

DT.Tank.prototype.shootBullet = function () {

    var bullet = false;
    var hitCallback = false;

    for ( var i = 0, il = this.bullets.length; i < il; i ++ ) {

        bullet = this.bullets[ i ];
        if ( bullet.active === false ) break;

    }

    //

    this.animations.shotAction.reset();
    this.animations.shotAction.play();
    this.animations.shotAction.time = 0;

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

        bullet.soundShooting.play();

        if ( localStorage.getItem('sound') === 'false' ) {
            bullet.soundShooting.setVolume( 0 );
        } else {
            bullet.soundShooting.setVolume( 1 );
        };

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

            if ( intersections.length && intersections[ 0 ].object.name !== 'tank' ) {

                if ( Utils.getDistance( bullet.position, intersections[ 0 ].point ) < 9 ) {
                
                    clearInterval( bullet.shotInterval );
                    bullet.visible = false;
                    bullet.active = false;
                    return;

                }

            }

            if ( ! ( intersections.length && intersections[ 0 ].object.name === 'tank' ) ) continue;

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

DT.Tank.prototype.updateBullets = function () {

    // todo

};

DT.Tank.prototype.setDamage = function () {

    // todo

};

DT.Tank.prototype.rotateTop = function () {

    // todo

};

DT.Tank.prototype.destroy = function () {

    var scope = this;

    this.animations.deathAction.reset();
    this.animations.deathAction.play();
    this.animations.deathAction.time = 0;

    setTimeout( function () { // todo: need to improve this

        scope.animations.deathAction.paused = true;

    }, 200 );

    this.sounds.explosion.play();
        if ( localStorage.getItem('sound') === 'false' ) {
            this.sounds.explosion.setVolume( 0 );
        } else {
            this.sounds.explosion.setVolume( 1 );
        };

};

DT.Tank.prototype.dispose = function () {

    // todo: dispose effects
    // todo: dispose bullets

    view.scene.remove( this.object );

};

DT.Tank.prototype.animate = function ( delta ) {

    if ( this.mixer ) {

        this.mixer.update( delta );

    }

};

DT.Tank.prototype.update = function ( delta ) {

    this.updateSmoke();
    this.updateBlastSmoke();
    this.updateBullets();
    this.animate();

};

DT.Tank.list = {};
DT.Tank.numID = 0;
