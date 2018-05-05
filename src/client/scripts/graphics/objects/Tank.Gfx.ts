/*
 * @author ohmed
 * DatTank Tank graphics class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";
import { TankLabelGfx } from "./../effects/TankLabel.Gfx";
import { TankCore } from "./../../core/objects/Tank.Core";
import { ResourceManager } from "./../../managers/Resource.Manager";
import { TankTracesGfx } from './../effects/TankTraces.Gfx';
import { LargeExplosionManager } from '../../managers/LargeExplosion.Manager';
import { FriendlyFireLabelGfx } from '../effects/FriendlyFireLabel.Gfx';
import { DamageSmokeGfx } from '../effects/DamageSmoke.Gfx';
import { BlastSmokeGfx } from '../effects/BlastSmoke.Gfx';

//

class TankGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private topMesh: THREE.Mesh;
    private baseMesh: THREE.Mesh;
    private mixer: THREE.AnimationMixer;
    private tank: TankCore;
    private traces: TankTracesGfx = new TankTracesGfx();
    public label: TankLabelGfx = new TankLabelGfx();
    public friendlyFireLabel: FriendlyFireLabelGfx = new FriendlyFireLabelGfx();
    public damageSmoke: DamageSmokeGfx = new DamageSmokeGfx();
    public blastSmoke: BlastSmokeGfx = new BlastSmokeGfx();

    private animations = {};
    private sounds = {};

    //

    private initSounds () {

        let movingSound = new THREE.PositionalAudio( GfxCore.audioListener );
        movingSound.setBuffer( ResourceManager.getSound('tank_moving.wav') );
        movingSound.setRefDistance( 11 );
        movingSound.autoplay = false;
        this.object.add( movingSound );
        this.sounds['moving'] = movingSound;

        let explosionSound = new THREE.PositionalAudio( GfxCore.audioListener );
        explosionSound.setBuffer( ResourceManager.getSound('tank_explosion.wav') );
        explosionSound.setRefDistance( 15 );
        explosionSound.autoplay = false;
        this.object.add( explosionSound );
        this.sounds['explosion'] = explosionSound;

    };

    public toggleMovementSound ( enable: boolean ) {

        let sound = this.sounds['moving'];

        if ( sound.buffer ) {

            if ( ! sound.isPlaying && enable ) {

                sound.play();
                sound.isPlaying = true;

            }

            if ( sound.isPlaying && ! enable ) {

                sound.stop();
                sound.startTime = false;
                sound.isPlaying = false;

            }

        }

    };

    public get2DPosition () {

        let vector = new THREE.Vector3();
        vector.setFromMatrixPosition( this.topMesh.matrixWorld );
        vector.project( GfxCore.camera );

        return vector;

    };

    public setPosition ( position: OMath.Vec3 ) {

        this.object.position.x = position.x;
        this.object.position.y = position.y;
        this.object.position.z = position.z;

    };

    public setRotation ( angle: number ) {

        this.object.rotation.y = angle;

    };

    public setTopRotation ( angle: number ) {

        this.topMesh.rotation.y = angle + Math.PI / 2;

    };

    public shoot () {

        // this.animations['shotAction'].stop();
        // this.animations['shotAction'].play();
        this.blastSmoke.show();

    };

    private updateTracks () {

        let tank = this.tank;

        // if tank moves update tracks

        let track1Map = this.baseMesh.material[1].map;
        let track2Map = this.baseMesh.material[2].map;

        if ( tank.moveDirection.x ) {

            track1Map.offset.y = track1Map.offset.y - 0.005 * tank.moveDirection.x;
            if ( track1Map.offset.y > 1 ) track1Map.offset.y = 0;

            track2Map.offset.y = track2Map.offset.y - 0.005 * tank.moveDirection.x;
            if ( track2Map.offset.y > 1 ) track2Map.offset.y = 0;

        } else if ( tank.moveDirection.y === -1 ) {

            track1Map.offset.y = track1Map.offset.y - 0.005;
            if ( track1Map.offset.y > 1 ) track1Map.offset.y = 0;

            track2Map.offset.y = track2Map.offset.y + 0.005;
            if ( track2Map.offset.y > 1 ) track2Map.offset.y = 0;

        } else if ( tank.moveDirection.y === 1 ) {

            track1Map.offset.y = track1Map.offset.y + 0.005;
            if ( track1Map.offset.y > 1 ) track1Map.offset.y = 0;

            track2Map.offset.y = track2Map.offset.y - 0.005;
            if ( track2Map.offset.y > 1 ) track2Map.offset.y = 0;

        }

    };

    public update ( time: number, delta: number ) {

        this.updateTracks();
        this.traces.update( time, delta );
        this.friendlyFireLabel.update( time, delta );
        this.damageSmoke.update( time, delta );
        this.blastSmoke.update( time, delta );
        this.mixer.update( delta / 1000 );

    };

    public init ( tank ) {

        this.tank = tank;

        let materials = [];
        let tankBaseModel = ResourceManager.getModel( 'tanks/' + tank.title + '-bottom' );
        let tankTopModel = ResourceManager.getModel( 'tanks/' + tank.title + '-top' );

        // add tank base mesh

        for ( let i = 0, il = tankBaseModel.material.length; i < il; i ++ ) {

            let material = tankBaseModel.material[ i ].clone();
            material.map = ResourceManager.getTexture( tank.title + '.jpg' ).clone();
            material.map.needsUpdate = true;
            material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
            material.morphTargets = true;
            materials.push( material );

        }

        this.baseMesh = new THREE.Mesh( tankBaseModel.geometry, materials );
        this.baseMesh.scale.set( 10, 10, 10 );
        this.object.add( this.baseMesh );

        // add tank top mesh

        materials = [];
        for ( var i = 0, il = tankTopModel.material.length; i < il; i ++ ) {

            let material = tankTopModel.material[ i ].clone();
            material.map = ResourceManager.getTexture( tank.title + '.jpg' ).clone();
            material.map.needsUpdate = true;
            material.morphTargets = true;
            materials.push( material );

        }

        this.topMesh = new THREE.Mesh( tankTopModel.geometry, materials );
        this.topMesh.scale.set( 10, 10, 10 );
        this.object.add( this.topMesh );

        // add tank shadow

        var tankShadowTexture = ResourceManager.getTexture( 'Tank-shadow.png' );
        var tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }) );
        tankShadow.scale.set( 13, 20, 1 );
        tankShadow.rotation.x = - Math.PI / 2;
        tankShadow.position.y += 0.5;
        tankShadow.renderOrder = 10;
        this.object.add( tankShadow );

        //

        this.mixer = new THREE.AnimationMixer( this.object );

        let shotAction, deathAction1, deathAction2;

        // shotAction = this.mixer.clipAction( tankTopModel.geometry.animations[0], this.topMesh );
        // shotAction.setDuration( 0.5 ).setLoop( THREE.LoopOnce, 1 );
        // this.animations['shotAction'] = shotAction;

        // deathAction1 = this.mixer.clipAction( tankTopModel.geometry.animations[1], this.topMesh );
        // deathAction1.setDuration( 1 ).setLoop( THREE.LoopOnce, 1 );
        // this.animations['deathAction1'] = deathAction1;

        // deathAction2 = this.mixer.clipAction( tankBaseModel.geometry.animations[0], this.baseMesh );
        // deathAction2.setDuration( 2 ).setLoop( THREE.LoopOnce, 1 );
        // this.animations['deathAction2'] = deathAction2;

        //

        this.friendlyFireLabel.init( this.object );
        this.damageSmoke.init( this.object );
        this.blastSmoke.init( this.topMesh, new OMath.Vec3( 0, 0, 5.5 ) );
        this.traces.init( this.object );
        this.label.init( this.object );
        this.label.update( this.tank.health, this.tank.armour, this.tank.player.team.color, this.tank.player.username );
        this.initSounds();

        //

        if ( ! GfxCore.coreObjects['tanks'] ) {

            GfxCore.coreObjects['tanks'] = new THREE.Object3D();
            GfxCore.coreObjects['tanks'].name = 'Tanks';
            GfxCore.scene.add( GfxCore.coreObjects['tanks'] );

        }

        GfxCore.coreObjects['tanks'].add( this.object );

    };

    public destroy () {

        this.animations['deathAction1'].stop();
        this.animations['deathAction2'].stop();

        this.animations['deathAction1'].play();
        this.animations['deathAction2'].play();

        setTimeout( () => {

            this.animations['deathAction1'].paused = true;
            this.animations['deathAction2'].paused = true;

        }, 1100 );

        LargeExplosionManager.showExplosion( this.tank.position );

        this.sounds['explosion'].play();

    };

    public dispose () {

        // stop all audio

        for ( var s in this.sounds ) {

            if ( this.sounds[ s ] ) this.sounds[ s ].pause();

        }

        // remove tank object from scene

        GfxCore.coreObjects['tanks'].remove( this.object );

    };

};

//

export { TankGfx };
