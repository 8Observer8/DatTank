/*
 * @author ohmed
 * DatTank Tank graphics class
*/

import * as THREE from 'three';

import { ResourceManager } from "./../../managers/Resource.Manager";

//

class TankGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private topMesh: THREE.Mesh;
    private baseMesh: THREE.Mesh;
    private mixer: THREE.AnimationMixer;

    private animations = {};
    private sounds: Array<object>;

    //

    public init ( tankTitle: string ) {

        // let materials = [];
        // let tankBaseModel = ResourceManager.getModel( tankTitle + '-base' );
        // let tankTopModel = ResourceManager.getModel( tankTitle + '-top' );

        // // add tank base mesh

        // for ( let i = 0, il = tankBaseModel.material.length; i < il; i ++ ) {
    
        //     let material = tankBaseModel.material[ i ].clone();
        //     material.map = material.map.clone();
        //     material.map.needsUpdate = true;
        //     material.morphTargets = true;
        //     materials.push( material );
    
        // }
    
        // this.baseMesh = new THREE.Mesh( tankBaseModel.geometry, materials );
        // this.baseMesh.scale.set( 10, 10, 10 );
        // this.object.add( this.baseMesh );

        // // add tank top mesh

        // materials = [];
        // for ( var i = 0, il = tankTopModel.material.length; i < il; i ++ ) {
    
        //     materials.push( tankTopModel.material[ i ].clone() );
        //     materials[ materials.length - 1 ].morphTargets = true;
    
        // }
    
        // this.topMesh = new THREE.Mesh( tankTopModel.geometry, materials );
        // this.topMesh.scale.set( 10, 10, 10 );
        // this.topMesh.position.y = 20;
        // this.object.add( this.topMesh );

        // // add tank shadow

        // var tankShadowTexture = ResourceManager.getTexture( 'shadowTank.png' );
        // var tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }) );
        // tankShadow.scale.set( 13, 20, 1 );
        // tankShadow.rotation.x = - Math.PI / 2;
        // tankShadow.position.y += 0.5;
        // tankShadow.renderOrder = 10;
        // this.object.add( tankShadow );

        // //

        // this.mixer = new THREE.AnimationMixer( this.topMesh );

        // var shotAction = this.mixer.clipAction( tankTopModel.geometry.animations[0], this.topMesh );
        // shotAction.setDuration( 0.5 ).setLoop( THREE.LoopOnce, 1 );
        // this.animations['shotAction'] = shotAction;

        // var deathAction1 = this.mixer.clipAction( tankTopModel.geometry.animations[1], this.topMesh );
        // deathAction1.setDuration( 1 ).setLoop( THREE.LoopOnce, 1 );
        // this.animations['deathAction1'] = deathAction1;

        // var deathAction2 = this.mixer.clipAction( tankBaseModel.geometry.animations[0], this.baseMesh );
        // deathAction2.setDuration( 2 ).setLoop( THREE.LoopOnce, 1 );
        // this.animations['deathAction2'] = deathAction2;

        //

        // view.scene.add( this.object );

    };

    public setTopRotation ( angle: number ) {

        // todo

    };

    public destroy () {

        this.animations['deathAction1'].stop();
        this.animations['deathAction1'].play();

        this.animations['deathAction2'].stop();
        this.animations['deathAction2'].play();

        setTimeout( () => {

            this.animations['deathAction1'].paused = true;
            this.animations['deathAction2'].paused = true;

        }, 1100 );

        this.sounds['explosion'].play();

    };

};

//

export { TankGfx };
