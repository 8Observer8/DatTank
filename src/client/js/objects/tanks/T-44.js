/*
 * @author ohmed
 * Tank "T-44" unit class
*/

Game.Tank.T44 = function ( params ) {

    Game.Tank.call( this, params );

    //

    this.model = {
        top:    'T44-top.json',
        base:   'T44-bottom.json'
    };

    this.trackOffset = { l: -3, r: -6 };

    this.name = 'T44';

};

Game.Tank.T44.prototype = Object.create( Game.Tank.prototype );

Game.Tank.T44.prototype.year = 1944;
Game.Tank.T44.prototype.ammoCapacity = 64;
Game.Tank.T44.prototype.speed = 51;
Game.Tank.T44.prototype.armour = 90;
Game.Tank.T44.prototype.bullet = 85;
Game.Tank.T44.prototype.rpm = 10.7 * 10;

//

Game.Tank.T44.prototype.initModel = function () {

    this.object = new THREE.Object3D();

    var materials;
    var tankBaseModel = resourceManager.getModel( this.model.base );
    var tankTopModel = resourceManager.getModel( this.model.top );

    //

    materials = [];
    for ( var i = 0, il = tankBaseModel.material.length; i < il; i ++ ) {

        var material = tankBaseModel.material[ i ].clone();
        material.map = material.map.clone();
        material.map.needsUpdate = true;
        material.morphTargets = true;
        materials.push( material );

    }

    var base = new THREE.Mesh( tankBaseModel.geometry, materials );
    base.rotation.y = 0;
    base.position.y = -2;
    base.scale.set( 12, 12, 12 );
    this.object.add( base );
    this.object.base = base;

    //

    materials = [];
    for ( var i = 0, il = tankTopModel.material.length; i < il; i ++ ) {

        materials.push( tankTopModel.material[ i ].clone() );
        materials[ materials.length - 1 ].morphTargets = true;

    }

    var tankShadowTexture = resourceManager.getTexture( 'shadowTank.png' );
    var tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }) );
    tankShadow.scale.set( 17, 20, 1 );
    tankShadow.rotation.x = - Math.PI / 2;
    tankShadow.position.y += 1;
    tankShadow.renderOrder = 10;

    this.object.add( tankShadow );

    //

    var top = new THREE.Mesh( tankTopModel.geometry, materials );
    top.castShadow = true;
    top.receiveShadow = true;
    top.position.y = 20;
    top.scale.set( 12, 12, 12 );

    this.object.add( top );
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

Game.Tank.T44.prototype.destroy = function () {

    var scope = this;

    this.animations.deathAction1.stop();
    this.animations.deathAction1.play();

    this.animations.deathAction2.stop();
    this.animations.deathAction2.play();

    this.showExplosion();

    setTimeout( function () {

        scope.animations.deathAction1.paused = true;
        scope.animations.deathAction2.paused = true;

    }, 1100 );

    this.sounds.explosion.play();

};

//

Game.Tank.list[ 'T44' ] = {
    title:          'T44',
    speed:          Game.Tank.T44.prototype.speed,
    rpm:            Game.Tank.T44.prototype.rpm,
    armour:         Game.Tank.T44.prototype.armour,
    bullet:         Game.Tank.T44.prototype.bullet,
    ammoCapacity:   Game.Tank.T44.prototype.ammoCapacity
};

Game.Tank.T44.prototype.showBlastSmoke = function () {

    this.blastSmokeEnabled = true;

    var scale;
    var sprite, material, map;

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

    map = resourceManager.getTexture( 'smoke.png' );
    material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true, transparent: true } );
    sprite = new THREE.Sprite( material );

    this.effects.blastSmoke = [];
    material.depthTest = true;
    material.depthWrite = false;

    for ( var i = 0; i <= 5; i ++ ) {

        sprite = sprite.clone();
        sprite.position.z = 0;
        sprite.position.y = 0;
        sprite.position.x = 2 + i / 7;
        sprite.material = sprite.material.clone();
        sprite.material.opacity = 0.8 - 0.8 / 5 * ( 5 - i );
        scale = 1 + i / 5;
        sprite.scale.set( scale, scale, scale );
        this.object.top.add( sprite );
        this.effects.blastSmoke.push( sprite );

    }

};
