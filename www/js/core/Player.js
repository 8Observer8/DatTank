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

    this.object = false;

    this.team = params.team;
    this.position = new THREE.Vector3( params.position[0], params.position[1], params.position[2] );
    this.rotation = params.rotation;

    this.topRotation = params.rotationTop;

    this.cannonPool = [];
    this.smokePool = [];
    this.blastSmokePool = [];

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

    this.blastSmokeEnabled = false;
    this.smokeEnabled = false;

    //

    this.prevTime = Date.now();
    this.lastShot = Date.now();

    this.init();

};

DT.Player.prototype = {};

DT.Player.prototype.init = function () {

    var scope = this;

    // create tank model

    this.object = new THREE.Object3D();

    //

    var tankBaseModel = resourceManager.getModel( 'Tank01_base.json' );

    var base = new THREE.Mesh( tankBaseModel.geometry, new THREE.MeshFaceMaterial( tankBaseModel.material ) );
    base.castShadow = true;
    base.rotation.y =  0;
    base.receiveShadow = true;
    base.scale.set( 20, 20, 20 );
    scope.object.add( base );

    scope.object.base = base;

    //

    var tankTopModel = resourceManager.getModel( 'Tank01_top.json' );

    var top = new THREE.Mesh( tankTopModel.geometry, new THREE.MeshFaceMaterial( tankTopModel.material ) );
    top.castShadow = true;
    top.receiveShadow = true;
    top.rotation.y = scope.topRotation;
    top.position.y = 20;
    top.scale.set( 20, 20, 20 );

    for ( var i = 0, il = top.material.materials.length; i < il; i ++ ) {

        top.material.materials[ i ].morphTargets = true;

    }

    scope.object.add( top );

    //

    var box = new THREE.Mesh( new THREE.BoxGeometry( 30, 40, 60 ), new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 }) );
    box.position.y = 10;
    box.name = 'tank';
    box.owner = this;
    scope.object.add( box );
    view.scene.intersections.push( box );

    scope.object.top = top;

    //

    scope.mixer = new THREE.AnimationMixer( top );

    var morphTargets = top.geometry.morphTargets;

    var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'shot', [ morphTargets[0], morphTargets[1], morphTargets[2] ], 30 );
    clip.duration = 30;
    scope.shotAction = scope.mixer.clipAction( clip );
    scope.shotAction.loop = THREE.LoopOnce;
    scope.shotAction.enabled = false;

    var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'death', [ morphTargets[2], morphTargets[3], morphTargets[4] ], 10 );
    clip.duration = 10;
    scope.deathAction = scope.mixer.clipAction( clip );
    scope.deathAction.duration = clip.duration;
    scope.deathAction.loop = THREE.LoopOnce;
    scope.deathAction.enabled = false;

    //

    this.object.rotation.y = scope.rotation;

    view.scene.add( this.object );

    this.object.position.set( this.position.x, this.position.y, this.position.z );

    // setup cannon pool

    for ( var i = 0; i < 5; i ++ ) {

        var cannon = new THREE.Mesh( new THREE.BoxGeometry( 2, 2, 2 ), new THREE.MeshLambertMaterial({ color: 0xff0000 }) );
        cannon.visible = false;
        cannon.active = false;

        this.cannonPool.push( cannon );
        view.scene.add( cannon );

        cannon.soundShooting = new THREE.PositionalAudio( view.sound.listener );
        cannon.soundShooting.setBuffer( resourceManager.getSound('tank_shooting.wav') );
        cannon.soundShooting.loop = false;
        cannon.soundShooting.setRefDistance( 30 );
        cannon.soundShooting.autoplay = false;
        cannon.soundShooting.setVolume( 1 );

        this.object.add( cannon.soundShooting );

    }

    //

    var canvas = document.createElement( 'canvas' );
    canvas.width = 30 + 20 * this.login.length;
    canvas.height = 25;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = DT.Team.colors[ this.team ];
    ctx.fillRect( 0, 0, 25, 25 );

    ctx.fillStyle = '#ffffff';
    ctx.font = '25px Arial';
    ctx.textAlign = 'left';
    ctx.fillText( this.login, 30, 20 );

    //

    var material = new THREE.SpriteMaterial({ map: new THREE.Texture( canvas ), color: 0xffffff });
    material.map.needsUpdate = true;

    var sprite = new THREE.Sprite( material );
    sprite.position.set( 0, 50, 0 );
    sprite.scale.set( canvas.width / 3, canvas.height / 3, 1 );
    material.depthWrite = false;
    material.depthTest = false;
    scope.object.add( sprite );

    Utils.ge('#ammo-image').style['background-image'] = "url('../resources/img/ammo1.png')";
    Utils.ge('#health-image').style['background-image'] = "url('../resources/img/health.png')";

    //

    this.sounds = {};

    this.sounds.moving = new THREE.PositionalAudio( view.sound.listener );
    this.sounds.moving.setBuffer( resourceManager.getSound('tank_moving.wav') );
    this.sounds.moving.loop = true;
    this.sounds.moving.setRefDistance( 15 );
    this.sounds.moving.autoplay = false;
    this.sounds.moving.setVolume( 0.3 );

    this.object.add( this.sounds.moving );

    this.sounds.explosion = new THREE.PositionalAudio( view.sound.listener );
    this.sounds.explosion.setBuffer( resourceManager.getSound('tank_explosion.wav') );
    this.sounds.explosion.loop = true;
    this.sounds.explosion.setRefDistance( 15 );
    this.sounds.explosion.autoplay = false;
    this.sounds.explosion.setVolume( 0.7 );

    this.object.add( this.sounds.explosion );

    //

    this.hit();

};

DT.Player.prototype.respawn = function ( fromNetwork, params ) {

    if ( fromNetwork ) {

        this.status = 'alive';
        this.ammo = 100;
        this.health = 100;

        this.position.set( params.position[0], params.position[1], params.position[2] );
        this.rotation = params.rotation;
        this.object.position.copy( this.position );

        this.object.rotation.y = params.rotation;
        this.topRotation = params.rotationTop;

        this.rotDelta = 0;
        this.rotationTopTarget = false;

        if ( this.id === DT.arena.me.id ) {

            view.camera.position.set( this.position.x + 180, view.camera.position.y, this.position.z );
            view.camera.lookAt( this.position );

            view.sunLight.position.set( this.position.x - 100, view.sunLight.position.y, this.position.z + 100 );
            view.sunLight.target = this.object;
            view.sunLight.target.updateMatrixWorld();

        }

        this.prevTime = Date.now();
        this.lastShot = Date.now();

        this.moveProgress = false;
        this.movePath = false;
        this.movementStart = false;
        this.stepDx = this.stepDy = this.stepDz = 0;
        this.moveDt = 0;
        this.moveSpeed = 0.09;

        this.shotAction.time = 0;
        this.deathAction.time = 0;

        this.deathAction.enabled = true;
        this.shotAction.enabled = true;

        this.mixer.update(0);

        this.deathAction.enabled = false;
        this.shotAction.enabled = false;

        this.object.rotation.y = 0;

        this.removeSmoke();
        this.removeBlastSmoke();

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

DT.Player.prototype.getFreeCannon = function () {

    for ( var i = 0, il = this.cannonPool.length; i < il; i ++ ) {

        if ( this.cannonPool[ i ].active === false ) {

            if ( DT.arena.me.id === this.id ) {

                this.lastShot = Date.now();
                var element = Utils.ge('#empty-ammo-image');
                // -> removing the class
                element.classList.remove("ammo-animation");
                element.style['height'] = '100%';

                // -> triggering reflow / The actual magic /
                // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
                element.offsetWidth;
                element.style['background-image'] = "url('../resources/img/ammo.png')";

                // -> and re-adding the class
                element.classList.add("ammo-animation");

            }

            return this.cannonPool[ i ];

        }

    }

    return false;

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

        if ( ! this.object.top ) return;

        //

        if ( ! fromNetwork ) {

            angle = angle - this.object.rotation.y;

        }

        angle = Utils.formatAngle( angle );

        this.rotationTopTarget = angle;
        this.topRotation = angle;
        this.object.top.rotation.y = angle;

        // var delta = angle - this.object.top.rotation.y;

        // if ( Math.abs( delta ) > Math.PI ) {

        //     delta = delta - Math.sign( delta ) * 2 * Math.PI;

        // }

        // this.rotDelta = delta;

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

        var cannon = this.getFreeCannon();

        if ( cannon ) {

            scope.shotAction.reset();
            scope.shotAction.play();
            scope.shotAction.time = 0;

            cannon.position.set( this.position.x, 25, this.position.z );
            cannon.active = true;
            cannon.flyTime = 0;

            if ( cannon.soundShooting.source.buffer ) {

                if ( cannon.soundShooting.isPlaying ) {

                    cannon.soundShooting.stop();
                    cannon.soundShooting.startTime = 0;
                    cannon.soundShooting.isPlaying = false;

                }

                cannon.soundShooting.play();

            }

            scope.blastSmokeEnabled = true;
            scope.addBlastSmoke();

            //

            var angle = - this.topRotation - this.object.rotation.y;
            var direction = new THREE.Vector3( Math.cos( angle ), 0, Math.sin( angle ) ).normalize();

            view.raycaster.ray.direction.set( direction.x, direction.y, direction.z );
            view.raycaster.ray.origin.set( this.position.x, 22, this.position.z );

            var intersections = view.raycaster.intersectObjects( view.scene.intersections );

            //

            cannon.shotInterval = setInterval( function ( angle, cn ) {

                for ( var j = 0; j < 10; j ++ ) {

                    var x = cn.position.x + Math.cos( angle ) * 0.4;
                    var z = cn.position.z + Math.sin( angle ) * 0.4;

                    cn.position.set( x, cn.position.y, z );

                    if ( intersections.length && intersections[ 0 ].object.name !== 'tank' ) {

                        if ( Utils.getDistance( cn.position, intersections[ 0 ].point ) < 9 ) {
                        
                            clearInterval( cn.shotInterval );
                            cn.visible = false;
                            cn.active = false;
                            return;

                        }

                    }

                    if ( ! ( intersections.length && intersections[ 0 ].object.name === 'tank' ) ) continue;

                    if ( Utils.getDistance( cn.position, intersections[ 0 ].point ) < 9 ) {

                        if ( scope.team !== intersections[ 0 ].object.owner.team ) {

                            bufferView[ 1 ] = intersections[ 0 ].object.owner.id;
                            bufferView[ 2 ] = shootId;
                            bufferView[ 3 ] = scope.id;

                            network.send( 'hit', buffer, bufferView );

                        }

                        clearInterval( cn.shotInterval );
                        cn.visible = false;
                        cn.active = false;
                        return;

                    }

                }

                cannon.flyTime ++;

                if ( cannon.flyTime > 15 ) {

                    cannon.visible = true;

                }

                if ( cannon.flyTime > 500 ) {

                    clearInterval( cannon.shotInterval );
                    cannon.visible = false;
                    cannon.active = false;

                }

            }, 3, angle, cannon );

            //

            if ( DT.arena.me.id === this.id ) {

                scope.ammo --;
                ui.updateAmmo( this.ammo );

            }

        }

    };

}) ();

DT.Player.prototype.hit = function () {

    if ( DT.arena && DT.arena.me.id === this.id ) {

        ui.updateHealth( this.health );

    }

    if ( this.health <= 50 ) {

        this.smokeEnabled = true;
        this.addSmoke();

    } else {

        this.removeSmoke();

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

    this.deathAction.reset();
    this.deathAction.play();
    this.deathAction.time = 0;

    var scope = this;
    setTimeout( function () { scope.deathAction.paused = true; }, 200 );

    DT.arena.teams[ killer.team ].kills ++;
    DT.arena.teams[ this.team ].death ++;

    this.movePath = [];

    this.death ++;
    killer.kills ++;

    this.sounds.explosion.play();

    ui.updateTeamScore( DT.arena.teams );
    ui.updateLeaderboard( DT.arena.players, DT.Arena.me );

};

DT.Player.prototype.dispose = function () {

    view.scene.remove( this.object );

};

DT.Player.prototype.addBlastSmoke = function () {

    var scale;

    if ( this.blastSmokePool.length ) {

        for ( var i = 0; i < this.blastSmokePool.length; i ++ ) {

            scale = 1 + i / 5;
            this.blastSmokePool[ i ].scale.set( scale, scale, scale );
            this.blastSmokePool[ i ].material.opacity = 0.8 - 0.8 / 5 * ( 5 - i );
            this.blastSmokePool[ i ].visible = true;

        }

        return;

    }

    var map = resourceManager.getTexture( 'smoke.png' );
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: false, transparent: true } );
    var sprite = new THREE.Sprite( material );

    this.blastSmokePool = [];
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
        this.blastSmokePool.push( sprite );

    }

};

DT.Player.prototype.removeBlastSmoke = function () {

    this.blastSmokeEnabled = false;

    for ( var i = 0; i < this.blastSmokePool.length; i ++ ) {

        this.blastSmokePool[ i ].opacity = 0;

    }

};

DT.Player.prototype.addSmoke = function () {

    if ( this.smokePool.length ) {

        for ( var i = 0; i < this.smokePool.length; i ++ ) {

            this.smokePool[ i ].visible = true;

        }

        return;

    }

    var map = resourceManager.getTexture( 'smoke.png' );
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: false, transparent: true } );
    var sprite = new THREE.Sprite( material );
    var scale;

    this.smokePool = [];
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
        this.smokePool.push( sprite );

    }

};

DT.Player.prototype.removeSmoke = function () {

    this.smokeEnabled = false;

    for ( var i = 0; i < this.smokePool.length; i ++ ) {

        this.smokePool[ i ].visible = false;

    }

};

DT.Player.prototype.animateBlastSmoke = function () {

    if ( ! this.blastSmokeEnabled || ! this.blastSmokePool.length ) return;

    var sprite, scale;

    var enabled = false;

    for ( var i = 0, il = this.blastSmokePool.length; i < il; i ++ ) {

        sprite = this.blastSmokePool[ i ];

        scale = sprite.scale.x + 0.05;
        sprite.material.opacity -= 0.8 / 20;
        
        if ( sprite.material.opacity < 0 ) {

        } else {

            enabled = true;

        }

        sprite.scale.set( scale, scale, scale );

    }

    if ( ! enabled ) {

        this.blastSmokeEnabled = false;

    }

};

DT.Player.prototype.animateSmoke = function () {

    if ( ! this.smokeEnabled || ! this.smokePool.length ) return;

    var sprite, scale;

    for ( var i = 0, il = this.smokePool.length; i < il; i ++ ) {

        sprite = this.smokePool[ i ];
        sprite.position.z = -15;

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

DT.Player.prototype.animateModel = function () {

    if ( this.mixer ) {

        var time = Date.now();
        var delta = ( time - this.prevTime ) * 0.001;

        // if ( this.deathAction.enabled && this.deathAction.time + 5 > this.deathAction.duration ) {

        //     this.deathAction.paused = true;

        // }

        this.mixer.update( delta );

        this.prevTime = time;

    }

};

DT.Player.prototype.animate = function () {

    this.animateSmoke();
    this.animateBlastSmoke();
    this.animateModel();

};
