/*
 * @author ohmed
 * Tank "USA-T54" unit class
*/

Game.Tank.USAT54 = function ( params ) {

    Game.Tank.call( this, params );

    //

    this.model = {
        top:    'Tank01_top.json',
        base:   'Tank01_base.json'
    };

    this.trackOffset = { l: -1, r: -9 };

    this.name = 'USA-T54';

};

Game.Tank.USAT54.prototype = Object.create( Game.Tank.prototype );

Game.Tank.USAT54.prototype.speed = 43;
Game.Tank.USAT54.prototype.range = 100;
Game.Tank.USAT54.prototype.armour = 180;
Game.Tank.USAT54.prototype.bullet = 105;
Game.Tank.USAT54.prototype.reloadTime = 20;

//

Game.Tank.USAT54.prototype.initModel = function () {

    this.object = new THREE.Object3D();

    var materials;
    var tankBaseModel = resourceManager.getModel( this.model.base );
    var tankTopModel = resourceManager.getModel( this.model.top );

    //

    materials = [];
    for ( var i = 0, il = tankBaseModel.material.length; i < il; i ++ ) {

        materials.push( tankBaseModel.material[ i ].clone() );
        materials[ materials.length - 1 ].morphTargets = true;

    }

    //

    var base = new THREE.Mesh( tankBaseModel.geometry, materials );
    base.rotation.y = 0;
    base.scale.set( 20, 20, 20 );
    this.object.add( base );
    this.object.base = base;

    //

    var tankShadowTexture = resourceManager.getTexture( 'shadowTank.png' );
    var tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }) );
    tankShadow.scale.set( 15, 17, 17 );
    tankShadow.rotation.x = - Math.PI / 2;
    tankShadow.position.y += 0.5;
    tankShadow.renderOrder = 2;

    this.object.add( tankShadow );

    //

    materials = [];
    for ( var i = 0, il = tankTopModel.material.length; i < il; i ++ ) {

        materials.push( tankTopModel.material[ i ].clone() );
        materials[ materials.length - 1 ].morphTargets = true;

    }

    var top = new THREE.Mesh( tankTopModel.geometry, materials );
    top.castShadow = true;
    top.receiveShadow = true;
    top.position.y = 0;
    top.scale.set( 20, 20, 20 );

    this.object.add( top );
    this.object.top = top;

    //

    this.mixer = new THREE.AnimationMixer( top );

    var shotAction = this.mixer.clipAction( top.geometry.animations[0], top );
    shotAction.setDuration( 0.5 ).setLoop( THREE.LoopOnce );
    this.animations.shotAction = shotAction;

    var deathAction1 = this.mixer.clipAction( top.geometry.animations[1], top );
    deathAction1.setDuration( 0.8 ).setLoop( THREE.LoopOnce );
    this.animations.deathAction1 = deathAction1;

    var deathAction2 = this.mixer.clipAction( base.geometry.animations[0], base );
    deathAction2.setDuration( 0.8 ).setLoop( THREE.LoopOnce );
    this.animations.deathAction2 = deathAction2;

    //

    view.scene.add( this.object );

};

Game.Tank.USAT54.prototype.destroy = function () {

    var scope = this;

    this.animations.deathAction1.stop();
    this.animations.deathAction1.play();

    this.animations.deathAction2.stop();
    this.animations.deathAction2.play();

    this.showExplosion();

    setTimeout( function () { // todo: need to improve this

        scope.animations.deathAction1.paused = true;
        scope.animations.deathAction2.paused = true;

    }, 750 );

    this.sounds.explosion.play();

};

//

Game.Tank.list[ 'USAT54' ] = {
    title:      'USA-T54',
    speed:      Game.Tank.USAT54.prototype.speed,
    range:      Game.Tank.USAT54.prototype.range,
    armour:     Game.Tank.USAT54.prototype.armour,
    bullet:     Game.Tank.USAT54.prototype.bullet
};

Game.Tank.USAT54.prototype.showBlastSmoke = function () {

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
        sprite.position.x = 2.9 + i / 7;
        sprite.material = sprite.material.clone();
        sprite.material.opacity = 0.8 - 0.8 / 5 * ( 5 - i );
        scale = 1 + i / 5;
        sprite.scale.set( scale, scale, scale );
        this.object.top.add( sprite );
        this.effects.blastSmoke.push( sprite );

    }

};
