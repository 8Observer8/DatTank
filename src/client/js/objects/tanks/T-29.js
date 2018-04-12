/*
 * @author ohmed
 * Tank "T-29" unit class
*/

Game.Tank.T29 = function ( params ) {

    Game.Tank.call( this, params );

    //

    this.model = {
        top:    'T29-top.json',
        base:   'T29-bottom.json'
    };

    this.trackOffset = { l: -1, r: -6 };

    this.name = 'T29';

};

Game.Tank.T29.prototype = Object.create( Game.Tank.prototype );

Game.Tank.T29.prototype.year = 1946;
Game.Tank.T29.prototype.ammoCapacity = 126;
Game.Tank.T29.prototype.speed = 35;
Game.Tank.T29.prototype.armour = 102;
Game.Tank.T29.prototype.bullet = 76;
Game.Tank.T29.prototype.rpm = 16.7 * 10;

//

Game.Tank.T29.prototype.initModel = function () {

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
    base.position.y += 2;
    base.scale.set( 8, 8, 8 );
    this.object.add( base );
    this.object.base = base;

    //

    var tankShadowTexture = resourceManager.getTexture( 'shadowTank.png' );
    var tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }) );
    tankShadow.scale.set( 13, 18, 1 );
    tankShadow.rotation.x = - Math.PI / 2;
    tankShadow.position.y += 0.5;
    tankShadow.renderOrder = 10;

    this.object.add( tankShadow );

    //

    materials = [];
    for ( var i = 0, il = tankTopModel.material.length; i < il; i ++ ) {

        materials.push( tankTopModel.material[ i ].clone() );
        materials[ materials.length - 1 ].morphTargets = true;

    }

    var top = new THREE.Mesh( tankTopModel.geometry, materials );
    top.position.y = 18;
    top.scale.set( 8, 8, 8 );

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
