/*
 * @author ohmed
 * Tower object class
*/

DT.Tower = function ( params ) {

    this.id = params.id;
    this.team = DT.arena.getTeamById( params.team ) || false;
    this.health = params.health;

    this.bullets = [];
    this.object = new THREE.Object3D();
    this.rotation = params.rotation || 0;
    this.position = new THREE.Vector3( params.position.x, params.position.y, params.position.z );

    this.animations = {};

    //

    this.initBullets();
    this.init();

};

DT.Tower.prototype = {};

DT.Tower.prototype.init = function () {

    var towerBaseModel = resourceManager.getModel('Tower_base.json');
    var towerTopModel = resourceManager.getModel('Tower_top.json');

    //

    var base = new THREE.Mesh( towerBaseModel.geometry, new THREE.MeshFaceMaterial( towerBaseModel.material ) );
    base.castShadow = true;
    base.rotation.y = 0;
    base.receiveShadow = true;
    base.scale.set( 27, 27, 27 );
    this.object.add( base );
    this.object.base = base;

    //

    var top = new THREE.Mesh( towerTopModel.geometry, new THREE.MeshFaceMaterial( towerTopModel.material ) );
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

};

DT.Tower.prototype.initBullets = function () {

    for ( var i = 0; i < 5; i ++ ) {

        var bullet = new THREE.Mesh( new THREE.BoxGeometry( 3, 3, 3 ), new THREE.MeshLambertMaterial({ color: 0xff0000 }) );
        bullet.visible = false;
        bullet.active = false;

        this.bullets.push( bullet );
        view.scene.add( bullet );

        bullet.soundShooting = new THREE.PositionalAudio( view.sound.listener );
        bullet.soundShooting.setBuffer( resourceManager.getSound('tank_shooting.wav') );
        bullet.soundShooting.loop = false;
        bullet.soundShooting.setRefDistance( 30 );
        bullet.soundShooting.autoplay = false;

        this.object.add( bullet.soundShooting );

    }

};

DT.Tower.prototype.rotateTop = function ( angle ) {

    this.rotation = angle;
    this.object.top.rotation.y = angle;

};

DT.Tower.prototype.shoot = function ( shootId ) {

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

DT.Tower.prototype.animate = function ( delta ) {

    if ( this.mixer ) {

        this.mixer.update( delta / 1000 );

    }

};

DT.Tower.prototype.hit = function () {

    // todo

};

DT.Tower.prototype.changeTeam = function ( team ) {

    this.team = team;

};

DT.Tower.prototype.updateHealth = function ( health ) {

    console.log( health );

};

DT.Tower.prototype.update = function ( delta ) {

    this.animate( delta );

};
