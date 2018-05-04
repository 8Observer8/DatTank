/*
 * @author ohmed
 * DatTank Tank graphics class
*/

import * as THREE from 'three';
import { MorphBlendMesh } from "./../utils/MorphMesh.Gfx";

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";
import { TowerLabelGfx } from "./../effects/TowerLabel.Gfx";
import { ResourceManager } from "./../../managers/Resource.Manager";
import { TowerCore } from './../../core/objects/Tower.Core';
import { TowerChangeTeamGfx } from './../effects/TowerChangeTeam.gfx';
import { BlastSmokeGfx } from './../effects/BlastSmoke.gfx';

//

class TowerGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private topMesh: MorphBlendMesh;
    private baseMesh: THREE.Mesh;
    private mixer: THREE.AnimationMixer;
    private tower: TowerCore;

    public label: TowerLabelGfx = new TowerLabelGfx();
    public changeTeamEffect: TowerChangeTeamGfx = new TowerChangeTeamGfx();
    public blastSmoke: BlastSmokeGfx = new BlastSmokeGfx();

    private animations = {};
    private sounds = {};

    //

    public update ( time: number, delta: number ) {

        this.changeTeamEffect.update( time, delta );
        this.blastSmoke.update( time, delta );
        this.topMesh.update( delta / 1000 );

    };

    public changeTeam ( color: number, skipAnimation: boolean ) {

        this.topMesh.material[1].color.setHex( color );
        this.baseMesh.material[1].color.setHex( color );

        //

        if ( ! skipAnimation ) {

            this.changeTeamEffect.show( color );

        }

    };

    public setTopRotation ( angle: number ) {

        this.topMesh.rotation.y = angle;

    };

    public setPosition ( position: OMath.Vec3 ) {

        this.object.position.x = position.x;
        this.object.position.y = position.y;
        this.object.position.z = position.z;

    };

    public shoot () {

        this.topMesh.stopAnimation('animation');
        this.topMesh.playAnimation('animation');
        this.blastSmoke.show();

    };

    public init ( tower ) {

        this.tower = tower;

        let materials = [];
        let towerBaseModel = ResourceManager.getModel( 'towers/' + tower.title + '-base' );
        let towerTopModel = ResourceManager.getModel( 'towers/' + tower.title + '-top' );

        // tower base part

        for ( let i = 0, il = towerBaseModel.material.length; i < il; i ++ ) {

            let material = towerBaseModel.material[ i ].clone();
            material.map = ResourceManager.getTexture('tower-texture.png');
            materials.push( material );

        }

        this.baseMesh = new THREE.Mesh( towerBaseModel.geometry, materials );
        this.baseMesh.rotation.y = 0;
        this.baseMesh.scale.set( 27, 27, 27 );
        this.object.add( this.baseMesh );

        // tower top part

        materials = [];

        for ( let i = 0, il = towerTopModel.material.length; i < il; i ++ ) {

            let material = towerTopModel.material[ i ].clone();
            material.morphTargets = true;
            materials.push( material );

        }

        materials[0].map = ResourceManager.getTexture('tower-texture.png');

        this.topMesh = new MorphBlendMesh( towerTopModel.geometry, materials );
        this.topMesh.rotation.y = tower.rotation;
        this.topMesh.scale.set( 27, 27, 27 );
        this.object.add( this.topMesh );

        //

        if ( ! GfxCore.coreObjects['towers'] ) {

            GfxCore.coreObjects['towers'] = new THREE.Object3D();
            GfxCore.coreObjects['towers'].name = 'Towers';
            GfxCore.scene.add( GfxCore.coreObjects['towers'] );

        }

        GfxCore.coreObjects['towers'].add( this.object );

        //

        this.blastSmoke.init( this.topMesh, new OMath.Vec3( 0, 1, - 2 ) );
        this.changeTeamEffect.init( this.object );
        this.label.init( this.object );

    };

    public dispose () {

        GfxCore.coreObjects['towers'].remove( this.object );

    };

};

//

export { TowerGfx };
