/*
 * @author ohmed
 * DatTank Tank graphics class
*/

import * as THREE from 'three';
import { MorphBlendMesh } from "./../utils/MorphMesh.Gfx";

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";
import { Arena } from "./../../core/Arena.Core";
import { TankLabelGfx } from "./../effects/TankLabel.Gfx";
import { TankObject } from "./../../objects/core/Tank.Object";
import { ResourceManager } from "./../../managers/Resource.Manager";
import { TankTracesGfx } from './../effects/TankTraces.Gfx';
import { LargeExplosionManager } from '../../managers/LargeExplosion.Manager';
import { FriendlyFireLabelGfx } from '../effects/FriendlyFireLabel.Gfx';
import { DamageSmokeGfx } from '../effects/DamageSmoke.Gfx';
import { BlastSmokeGfx } from '../effects/BlastSmoke.Gfx';
import { CollisionManager } from '../../managers/Collision.Manager';

//

class TankGfx {

    public object: THREE.Object3D = new THREE.Object3D();
    private topMesh: MorphBlendMesh;
    private baseMesh: MorphBlendMesh;
    private tank: TankObject;
    private traces: TankTracesGfx = new TankTracesGfx();
    public label: TankLabelGfx = new TankLabelGfx();
    public friendlyFireLabel: FriendlyFireLabelGfx = new FriendlyFireLabelGfx();
    public damageSmoke: DamageSmokeGfx = new DamageSmokeGfx();
    public blastSmoke: BlastSmokeGfx = new BlastSmokeGfx();

    public interpolationTime: number = 0;

    private sounds = {};

    //

    public rotateTankXAxis ( delta: number ) {

        this.topMesh.rotation.x += delta;
        this.baseMesh.rotation.x += delta;

        this.topMesh.rotation.x *= 0.9;
        this.baseMesh.rotation.x *= 0.9;
        
    };

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

        this.topMesh.playAnimation('shoot');
        this.blastSmoke.show();

    };

    private updateTracks () {

        let tank = this.tank;

        if ( tank.health <= 0 ) {

            return;

        }

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
        
        this.topMesh.update( delta / 1000 );
        this.baseMesh.update( delta / 1000 );

        // interpolate tank movement between cannon physic generated points

        this.interpolationTime += delta;
        let progress = this.interpolationTime / CollisionManager.updateRate;
        progress = Math.min( progress, 1 );

        this.object.rotation.y = progress * this.tank.rotation + ( 1 - progress ) * this.tank.prevRotation;

        this.object.position.x = progress * this.tank.position.x + ( 1 - progress ) * this.tank.prevPosition.x;
        this.object.position.y = progress * this.tank.position.y + ( 1 - progress ) * this.tank.prevPosition.y;
        this.object.position.z = progress * this.tank.position.z + ( 1 - progress ) * this.tank.prevPosition.z;

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

        this.baseMesh = new MorphBlendMesh( tankBaseModel.geometry, materials );
        this.baseMesh.scale.set( 10, 10, 10 );
        this.object.add( this.baseMesh );
        this.object.rotation.y = tank.rotation;

        // add tank top mesh

        materials = [];
        for ( var i = 0, il = tankTopModel.material.length; i < il; i ++ ) {

            let material = tankTopModel.material[ i ].clone();
            material.map = ResourceManager.getTexture( tank.title + '.jpg' ).clone();
            material.map.needsUpdate = true;
            material.morphTargets = true;
            materials.push( material );

        }

        this.topMesh = new MorphBlendMesh( tankTopModel.geometry, materials );
        this.topMesh.scale.set( 10, 10, 10 );
        this.object.add( this.topMesh );
        this.topMesh.setAnimationFPS( 'shoot', 6 );

        // add tank shadow

        var tankShadowTexture = ResourceManager.getTexture( 'Tank-shadow.png' );
        var tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }) );
        tankShadow.scale.set( 13, 20, 1 );
        tankShadow.rotation.x = - Math.PI / 2;
        tankShadow.position.y += 0.5;
        tankShadow.renderOrder = 10;
        this.object.add( tankShadow );

        //

        this.friendlyFireLabel.init( this.object );
        this.damageSmoke.init( this.object );
        this.blastSmoke.init( this.topMesh, new OMath.Vec3( 0, 0, 5.5 ) );
        this.traces.init( this.object );
        this.label.init( this.object );
        this.label.update( this.tank.health, this.tank.armour, this.tank.player.team.color, this.tank.overheating, this.tank.player.username );
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

        this.topMesh.playAnimation('death');
        this.baseMesh.playAnimation('death');

        LargeExplosionManager.showExplosion( this.tank.position );

        this.sounds['explosion'].play();

    };

    public makeTankDestroyed () {

        this.topMesh.setFrame( 'death', 2 );
        this.baseMesh.setFrame( 'death', 2 );

    };

    public dispose () {

        // dispose tank traces

        this.traces.dispose();

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
