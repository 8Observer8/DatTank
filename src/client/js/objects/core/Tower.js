/*
 * @author ohmed
 * Tower object class
*/

Game.Tower = function ( arena, params ) {

    EventDispatcher.call( this );

    this.id = params.id;
    this.arena = arena;

    this.team = this.arena.teamManager.getById( params.team ) || false;
    this.health = params.health;

    this.bullets = [];

    this.object = new THREE.Object3D();
    this.rotation = params.rotation || 0;
    this.position = new THREE.Vector3( params.position.x, params.position.y, params.position.z );

    this.animations = {};
    this.healthBar = false;
    this.bulletSpeed = 1.5;

    //

    this.initBullets();
    this.init();

    //

    this.changeTeam( this.team.id, true );

};

Game.Tower.prototype = Object.create( EventDispatcher.prototype );

//

Game.Tower.prototype.init = function () {

    var towerBaseModel = resourceManager.getModel('Tower_base.json');
    var towerTopModel = resourceManager.getModel('Tower_top.json');

    //

    var base = new THREE.Mesh( towerBaseModel.geometry, towerBaseModel.material );
    base.rotation.y = 0;
    base.scale.set( 27, 27, 27 );
    this.object.add( base );
    this.object.base = base;

    for ( var i = 0, il = base.material.length; i < il; i ++ ) {

        base.material[ i ] = base.material[ i ].clone();

    }

    //

    var materials = [];
    for ( var i = 0, il = towerTopModel.material.length; i < il; i ++ ) {

        materials.push( towerTopModel.material[ i ].clone() );
        materials[ materials.length - 1 ].morphTargets = true;

    }

    var top = new THREE.Mesh( towerTopModel.geometry, materials );
    top.rotation.y = this.rotation;
    top.scale.set( 27, 27, 27 );

    this.object.add( top );
    this.object.top = top;

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

Game.Tower.prototype.shoot = function ( bulletId ) {

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

    bullet.directionRotation = - this.object.top.rotation.y - this.object.rotation.y - 1.57;

    var offsetDist = 55;
    var offsetX = offsetDist * Math.cos( bullet.directionRotation );
    var offsetZ = offsetDist * Math.sin( bullet.directionRotation );

    bullet.startPos = new THREE.Vector3( this.object.position.x + offsetX, 25, this.object.position.z + offsetZ );
    bullet.position.set( this.object.position.x + offsetX, 25, this.object.position.z + offsetZ );
    bullet.trace.position.set( this.object.position.x + offsetX, 25, this.object.position.z + offsetZ );
    bullet.trace.rotation.z = - bullet.directionRotation;
    bullet.trace.scale.set( 1, 1, 1 );

    //

    if ( bullet.soundShooting.buffer ) {

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

    bullet.visible = true;
    bullet.trace.visible = true;

};

Game.Tower.prototype.animate = function ( delta ) {

    if ( this.mixer ) {

        this.mixer.update( delta / 1000 );

    }

};

Game.Tower.prototype.changeTeam = function ( team, init ) {

    team = this.arena.teamManager.getById( team );
    if ( ! team ) return;

    this.team = team;

    this.object.top.material[1].color.setHex( + team.color.replace('#', '0x') );
    this.object.base.material[1].color.setHex( + team.color.replace('#', '0x') );

    if ( ! init ) this.health = 100;

    this.updateHealthBar();

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

        this.rotation = Utils.formatAngle( this.rotation + Math.sign( deltaRot ) / 30 * ( delta / 50 ) );
        this.object.top.rotation.y = this.rotation;

    }

    for ( var bulletId in this.bullets ) {

        var bullet = this.bullets[ bulletId ];

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

Game.Tower.prototype.dispose = function () {

    view.scene.remove( this.object );

    for ( var i = 0, il = this.bullets.length; i < il; i ++ ) {

        view.scene.remove( this.bullets[ i ] );
        view.scene.remove( this.bullets[ i ].trace );

    }

};

Game.Tower.prototype.addEventListeners = function () {

    var scope = this;

    this.addEventListener( 'TowerRotateTop', function ( event ) { scope.rotateTop( event.data[1] / 1000, event.data[2] / 1000 ); });
    this.addEventListener( 'TowerShoot', function ( event ) { scope.shoot( event.data[1] ); });
    this.addEventListener( 'TowerChangeTeam', function ( event ) { scope.changeTeam( event.data[1] ); });
    this.addEventListener( 'TowerUpdateHealth', function ( event ) { scope.updateHealth( event.data[1] ); });

};
