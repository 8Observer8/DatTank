/*
 * @author ohmed
 * Tank "USA-T54" unit class
*/

DT.Tank.USAT54 = function ( params ) {

    DT.Tank.call( this, params );

    //

    this.model = {
        top:    'Tank01_top.json',
        base:   'Tank01_base.json'
    };

    this.name = 'USA-T54';

};

DT.Tank.USAT54.prototype = Object.create( DT.Tank.prototype );

DT.Tank.USAT54.prototype.speed = 43;
DT.Tank.USAT54.prototype.range = 100;
DT.Tank.USAT54.prototype.armour = 180;
DT.Tank.USAT54.prototype.bullet = 105;

DT.Tank.USAT54.prototype.initModel = function () {

    this.object = new THREE.Object3D();

    var tankBaseModel = resourceManager.getModel( this.model.base );
    var tankTopModel = resourceManager.getModel( this.model.top );

    //

    var base = new THREE.Mesh( tankBaseModel.geometry, new THREE.MultiMaterial( tankBaseModel.material ) );
    // base.geometry.morphTargets = tankBaseModel.geometry.morphTargets;
    base.castShadow = true;
    base.rotation.y = 0;
    base.receiveShadow = true;
    base.scale.set( 20, 20, 20 );
    base.material.morphTargets = true;
    this.object.add( base );
    this.object.base = base;

    //

    var top = new THREE.Mesh( tankTopModel.geometry, new THREE.MultiMaterial( tankTopModel.material ) );
    top.castShadow = true;
    top.receiveShadow = true;
    top.position.y = 0;
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

    var shotAction = this.mixer.clipAction( top.geometry.animations[0], top );
    shotAction.setDuration( 0.5 ).setLoop( THREE.LoopOnce );
    this.animations.shotAction = shotAction;

    var deathAction = this.mixer.clipAction( top.geometry.animations[1], top );
    deathAction.setDuration( 0.8 ).setLoop( THREE.LoopOnce );
    this.animations.deathAction = deathAction;

    //

    view.scene.add( this.object );

};

//

DT.Tank.list[ 'USAT54' ] = {
    title:      'USA-T54',
    speed:      DT.Tank.USAT54.prototype.speed,
    range:      DT.Tank.USAT54.prototype.range,
    armour:     DT.Tank.USAT54.prototype.armour,
    bullet:     DT.Tank.USAT54.prototype.bullet
};
