/*
 * @author ohmed
 * DatTank Tank graphics class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";
import { ResourceManager } from "./../../managers/Resource.Manager";

//

class TowerGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private topMesh: THREE.Mesh;
    private baseMesh: THREE.Mesh;
    private mixer: THREE.AnimationMixer;

    private animations = {};
    private sounds: Array<object>;

    //

    public init ( towerTitle: string ) {

        let materials = [];
        let towerBaseModel = ResourceManager.getModel( towerTitle + '-tower-base' );
        let towerTopModel = ResourceManager.getModel( towerTitle + '-tower-top' );

        // tower base part

        for ( let i = 0, il = towerBaseModel.material.length; i < il; i ++ ) {

            let material = towerBaseModel.material[ i ].clone();
            materials.push( material );

        }

        this.baseMesh = new THREE.Mesh( towerBaseModel.geometry, materials );
        this.baseMesh.rotation.y = 0;
        this.baseMesh.scale.set( 27, 27, 27 );
        this.object.add( this.baseMesh );

        // tower top part

        materials.length = 0;

        for ( let i = 0, il = towerTopModel.material.length; i < il; i ++ ) {

            let material = towerTopModel.material[ i ].clone();
            material.morphTargets = true;
            materials.push( material );

        }

        this.topMesh = new THREE.Mesh( towerTopModel.geometry, materials );
        // this.topMesh.rotation.y = this.rotation;
        this.topMesh.scale.set( 27, 27, 27 );
        this.object.add( this.topMesh );

        //

        GfxCore.scene.add( this.object );

        //

        this.mixer = new THREE.AnimationMixer( top );

        let shotAction = this.mixer.clipAction( towerTopModel.geometry.animations[0], this.topMesh );
        shotAction.setDuration( 0.5 ).setLoop( THREE.LoopOnce, 1 );
        this.animations['shotAction'] = shotAction;

    };

    public setTopRotation ( angle: number ) {

        // todo

    };

    public setPosition ( position: OMath.Vec3 ) {

        this.object.position.x = position.x;
        this.object.position.y = position.y;
        this.object.position.z = position.z;

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

    public dispose () {

        GfxCore.scene.remove( this.object );
        // GfxCore.scene.remove( this.changeTeamEffectPipe );

    };

};

//

export { TowerGfx };
