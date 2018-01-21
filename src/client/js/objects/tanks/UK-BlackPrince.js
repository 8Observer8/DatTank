/*
 * @author ohmed
 * Tank "USA-T54" unit class
*/

Game.Tank.UKBlackPrince = function ( params ) {

    Game.Tank.call( this, params );

    //

    this.model = {
        top:    'Tank02_top.json',
        base:   'Tank02_base.json'
    };

    this.trackOffset = { l: -3, r: -6 };

    this.name = 'UK-Black-Prince';

};

Game.Tank.UKBlackPrince.prototype = Object.create( Game.Tank.prototype );

Game.Tank.UKBlackPrince.prototype.speed = 30;
Game.Tank.UKBlackPrince.prototype.range = 160;
Game.Tank.UKBlackPrince.prototype.armour = 252;
Game.Tank.UKBlackPrince.prototype.bullet = 77;
Game.Tank.UKBlackPrince.prototype.reloadTime = 40;

Game.Tank.UKBlackPrince.prototype.initModel = function () {

    this.object = new THREE.Object3D();

    var tankBaseModel = resourceManager.getModel( this.model.base );
    var tankTopModel = resourceManager.getModel( this.model.top );

    //

    var materials = [];
    for ( var i = 0, il = tankBaseModel.material.length; i < il; i ++ ) {

        materials.push( tankBaseModel.material[ i ].clone() );
        materials[ materials.length - 1 ].morphTargets = true;

    }

    var base = new THREE.Mesh( tankBaseModel.geometry, materials );
    base.rotation.y = 0;
    base.position.y = 5;
    base.scale.set( 20, 20, 20 );
    this.object.add( base );
    this.object.base = base;

    //

    var materials = [];
    for ( var i = 0, il = tankTopModel.material.length; i < il; i ++ ) {

        materials.push( tankTopModel.material[ i ].clone() );
        materials[ materials.length - 1 ].morphTargets = true;

    }

    var tankShadowTexture = resourceManager.getTexture( 'shadowTank.png' );
    var tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }) );
    tankShadow.scale.set( 15, 17, 17 );
    tankShadow.rotation.x = - Math.PI / 2;
    tankShadow.position.y += 0.5;
    tankShadow.renderOrder = 2;

    this.object.add( tankShadow );

    //

    var top = new THREE.Mesh( tankTopModel.geometry, materials );
    top.castShadow = true;
    top.receiveShadow = true;
    top.position.y = 20;
    top.position.x = 2;
    top.position.z = 2;
    top.scale.set( 20, 20, 20 );

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

Game.Tank.UKBlackPrince.prototype.destroy = function () {

    var scope = this;

    this.animations.deathAction1.stop();
    this.animations.deathAction1.play();

    this.animations.deathAction2.stop();
    this.animations.deathAction2.play();

    this.showExplosion();

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

Game.Tank.list[ 'UKBlackPrince' ] = {
    title:      'UK-Black-Prince',
    speed:      Game.Tank.UKBlackPrince.prototype.speed,
    range:      Game.Tank.UKBlackPrince.prototype.range,
    armour:     Game.Tank.UKBlackPrince.prototype.armour,
    bullet:     Game.Tank.UKBlackPrince.prototype.bullet
};

Game.Tank.UKBlackPrince.prototype.showBlastSmoke = function () {

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
