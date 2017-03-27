
Game.Tank.D32 = function ( params ) {

    Game.Tank.call( this, params );

    //

    this.model = {
        top:    'Tank03_top.json',
        base:   'Tank03_base.json'
    };

    this.name = 'D-32';

};

Game.Tank.D32.prototype = Object.create( Game.Tank.prototype );

Game.Tank.D32.prototype.speed = 50;
Game.Tank.D32.prototype.range = 160;
Game.Tank.D32.prototype.armour = 150;
Game.Tank.D32.prototype.bullet = 77;
Game.Tank.D32.prototype.reloadTime = 100;

Game.Tank.D32.prototype.initModel = function () {

    this.object = new THREE.Object3D();

    var tankBaseModel = resourceManager.getModel( this.model.base );
    var tankTopModel = resourceManager.getModel( this.model.top );

    //

    var base = new THREE.Mesh( tankBaseModel.geometry, new THREE.MeshFaceMaterial( tankBaseModel.material ) );
    base.castShadow = true;
    base.rotation.y = 0;
    base.receiveShadow = true;
    base.scale.set( 20, 20, 20 );
    this.object.add( base );
    this.object.base = base;

    for ( var i = 0, il = base.material.materials.length; i < il; i ++ ) {

        base.material.materials[ i ].morphTargets = true;

    }

    //

    var tankShadowTexture = resourceManager.getTexture( 'shadowTank.png' );
    var tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
    tankShadow.scale.set( 15, 17, 17 );
    tankShadow.rotation.x = - Math.PI / 2;
    tankShadow.position.y += 0.5;

    this.object.add( tankShadow );

    //

    var top = new THREE.Mesh( tankTopModel.geometry, new THREE.MeshFaceMaterial( tankTopModel.material ) );
    top.castShadow = true;
    top.receiveShadow = true;
    top.position.y = 20;
    top.position.x = 0;
    top.position.z = 7;
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

    var shotAction = this.mixer.clipAction( tankTopModel.geometry.animations[0], top );
    shotAction.setDuration( 0.5 ).setLoop( THREE.LoopOnce );
    this.animations.shotAction = shotAction;

    var deathAction1 = this.mixer.clipAction( tankTopModel.geometry.animations[1], top );
    deathAction1.setDuration( 1 ).setLoop( THREE.LoopOnce );
    this.animations.deathAction1 = deathAction1;

    var deathAction2 = this.mixer.clipAction( tankBaseModel.geometry.animations[0], base );
    deathAction2.setDuration( 2 ).setLoop( THREE.LoopOnce );
    this.animations.deathAction2 = deathAction2;

    //

    view.scene.add( this.object );

};

Game.Tank.D32.prototype.destroy = function () {

    var scope = this;

    this.animations.deathAction1.stop();
    this.animations.deathAction1.play();

    this.animations.deathAction2.stop();
    this.animations.deathAction2.play();

    this.moveProgress = false;
    this.movementDurationMap = [];
    this.moveProgress = 0;

    setTimeout( function () {

        scope.animations.deathAction1.paused = true;
        scope.animations.deathAction2.paused = true;

    }, 1100 );

    if ( localStorage.getItem('sound') !== 'false' ) {

        this.sounds.explosion.play();

    }

};

//

Game.Tank.list[ 'D32' ] = {
    title:      'D-32',
    speed:      Game.Tank.D32.prototype.speed,
    range:      Game.Tank.D32.prototype.range,
    armour:     Game.Tank.D32.prototype.armour,
    bullet:     Game.Tank.D32.prototype.bullet
};

Game.Tank.D32.prototype.showBlastSmoke = function () {

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
        sprite.position.x = 1.9 + i / 7;
        sprite.material = sprite.material.clone();
        sprite.material.opacity = 0.8 - 0.8 / 5 * ( 5 - i );
        scale = 1 + i / 5;
        sprite.scale.set( scale, scale, scale );
        this.object.top.add( sprite );        
        this.effects.blastSmoke.push( sprite );

    }

};