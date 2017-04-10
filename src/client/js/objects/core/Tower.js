/*
 * @author ohmed
 * Tower object class
*/

Game.Tower = function ( arena, params ) {

    EventDispatcher.call( this );

    this.arena = arena;

    this.id = params.id;
    this.team = this.arena.teamManager.getById( params.team ) || false;
    this.health = params.health;

    this.bullets = [];
    this.object = new THREE.Object3D();
    this.rotation = params.rotation || 0;
    this.position = new THREE.Vector3( params.position.x, params.position.y, params.position.z );

    this.animations = {};
    this.healthBar = false;

    //

    this.initBullets();
    this.init();

    //

    this.changeTeam( this.team.id );

};

Game.Tower.prototype = Object.create( EventDispatcher.prototype );

Game.Tower.prototype.init = function () {

    var towerBaseModel = resourceManager.getModel('Tower_base.json');
    var towerTopModel = resourceManager.getModel('Tower_top.json');

    //

    var base = new THREE.Mesh( towerBaseModel.geometry, new THREE.MeshFaceMaterial( towerBaseModel.material ).clone() );
    base.castShadow = true;
    base.rotation.y = 0;
    base.receiveShadow = true;
    base.scale.set( 27, 27, 27 );
    this.object.add( base );
    this.object.base = base;

    //

    var top = new THREE.Mesh( towerTopModel.geometry, new THREE.MeshFaceMaterial( towerTopModel.material ).clone() );
    top.castShadow = true;
    top.receiveShadow = true;
    top.position.y = 0;
    top.scale.set( 27, 27, 27 );

    for ( var i = 0, il = top.material.materials.length; i < il; i ++ ) {

        top.material.materials[ i ].morphTargets = true;

    }

    this.object.add( top );
    this.object.top = top;

    //

    var box = new THREE.Mesh( new THREE.BoxGeometry( 30, 40, 60 ), new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 }) );
    box.position.y = 10;
    box.name = 'tower';
    box.owner = this;
    box.material.visible = false;
    this.object.add( box );
    view.scene.intersections.push( box );

    //

    view.scene.add( this.object );

    this.object.position.set( this.position.x, this.position.y, this.position.z );

    //

    this.mixer = new THREE.AnimationMixer( top );

    var shotAction = this.mixer.clipAction( towerTopModel.geometry.animations[0], top );
    shotAction.setDuration( 0.5 ).setLoop( THREE.LoopOnce );
    this.animations.shotAction = shotAction;

    //

    this.updateHealthBar();
    this.rotateTop( this.rotation, this.rotation );

    this.addEventListeners();

};

Game.Tower.prototype.initBullets = function () {

    for ( var i = 0; i < 5; i ++ ) {

        var bullet = new THREE.Mesh( new THREE.SphereGeometry( 3.4, 10, 10 ), new THREE.MeshLambertMaterial({ color: 0x7A3EA8 }) );
        bullet.visible = false;
        bullet.active = false;

        this.bullets.push( bullet );
        view.scene.add( bullet );

        bullet.soundShooting = new THREE.PositionalAudio( view.sound.listener );
        bullet.soundShooting.setBuffer( resourceManager.getSound('tank_shooting.wav') );
        bullet.soundShooting.loop = false;
        bullet.soundShooting.setRefDistance( 30 );
        bullet.soundShooting.autoplay = false;
        bullet.soundShooting.setVolume(0.5);

        this.object.add( bullet.soundShooting );

    }

};

Game.Tower.prototype.updateHealthBar = function () {

    if ( ! this.healthBar ) {

        var bg = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0xffffff, fog: true } ) );
        var healthBar = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0x00ff00, fog: true } ) );
        healthBar.position.set( 0, 50, 0 );
        healthBar.scale.set( 50, 2, 1 );

        this.healthBar = {
            bg:     bg,
            health: healthBar
        };

        this.object.add( this.healthBar.health );

    }

    //

    this.healthBar.health.scale.x = 50 * this.health / 100;

};

Game.Tower.prototype.rotateTop = function ( oldAngle, newAngle ) {

    this.newRotation = newAngle;

    this.rotation = oldAngle;
    this.object.top.rotation.y = oldAngle;

};

Game.Tower.prototype.shoot = function ( shootId ) {

    var bullet = false;
    var hitCallback = false;
    var scope = this;

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

    var angle = - Math.PI / 2 - this.object.top.rotation.y;
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

                //

                var buffer = new ArrayBuffer( 8 );
                var bufferView = new Uint16Array( buffer );

                bufferView[ 1 ] = intersections[ 0 ].object.owner.id;
                bufferView[ 2 ] = shootId;
                bufferView[ 3 ] = scope.id;

                network.send( 'PlayerTankHit', buffer, bufferView );

                //

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

Game.Tower.prototype.animate = function ( delta ) {

    if ( this.mixer ) {

        this.mixer.update( delta / 1000 );

    }

};

Game.Tower.prototype.changeTeam = function ( team ) {

    team = this.arena.teamManager.getById( team );
    if ( ! team ) return;

    this.team = team;

    this.object.top.material.materials[1].color.setHex( + team.color.replace('#', '0x') );
    this.object.base.material.materials[1].color.setHex( + team.color.replace('#', '0x') );

    this.health = 100;
    this.updateHealthBar();

    //

    team.kills ++;
    ui.updateTeamScore( Game.arena );

};

Game.Tower.prototype.updateHealth = function ( health ) {

    this.health = health;
    this.updateHealthBar();

};

Game.Tower.prototype.update = function ( delta ) {

    this.animate( delta );

    //

    var deltaRot = Utils.formatAngle( this.newRotation ) - Utils.formatAngle( this.rotation );

    if ( deltaRot > Math.PI ) {

        if ( deltaRot > 0 ) {

            deltaRot = - 2 * Math.PI + deltaRot;

        } else {

            deltaRot = 2 * Math.PI + deltaRot;

        }

    }

    if ( Math.abs( deltaRot ) > 0.01 ) {
        
        this.rotation += Math.sign( deltaRot ) / 30 * ( delta / 20 );
        this.object.top.rotation.y = this.rotation;

    }

};

Game.Tower.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'TowerRotateTop', function ( event ) { scope.rotateTop( event.data[1] / 1000, event.data[2] / 1000 ); });
    this.addEventListener( 'TowerShoot', function ( event ) { scope.shoot( event.data[1] ); });
    this.addEventListener( 'TowerChangeTeam', function ( event ) { scope.changeTeam( event.data[1] ); });
    this.addEventListener( 'TowerHit', function ( event ) { scope.updateHealth( event.data[1] ); });

};
