/*
 * @author ohmed
 * DatTank Tank graphics class
*/

import * as THREE from 'three';
import { MorphBlendMesh } from '../utils/MorphMesh.Gfx';

import * as OMath from '../../OMath/Core.OMath';
import { GfxCore } from '../Core.Gfx';
import { TankLabelGfx } from '../effects/TankLabel.Gfx';
import { TankObject } from '../../objects/core/Tank.Object';
import { ResourceManager } from '../../managers/Resource.Manager';
import { TankTracesGfx } from '../effects/TankTraces.Gfx';
import { LargeExplosionManager } from '../../managers/LargeExplosion.Manager';
import { FriendlyFireLabelGfx } from '../effects/FriendlyFireLabel.Gfx';
import { DamageSmokeGfx } from '../effects/DamageSmoke.Gfx';
import { BlastSmokeGfx } from '../effects/BlastSmoke.Gfx';
import { Game } from '../../Game';

//

class TankGfx {

    public wrapper: THREE.Object3D = new THREE.Object3D();
    public object: THREE.Object3D = new THREE.Object3D();
    private hull: THREE.Mesh;
    private cannon: MorphBlendMesh;
    private tank: TankObject;
    private traces: TankTracesGfx = new TankTracesGfx();
    public label: TankLabelGfx = new TankLabelGfx();
    public friendlyFireLabel: FriendlyFireLabelGfx = new FriendlyFireLabelGfx();
    public damageSmoke: DamageSmokeGfx = new DamageSmokeGfx();
    public blastSmoke: BlastSmokeGfx = new BlastSmokeGfx();

    private hide: boolean = false;
    private sounds = {};

    //

    public rotateTankXAxis ( delta: number ) : void {

        this.wrapper.rotation.x += delta;
        this.wrapper.rotation.x *= 0.9;

    };

    private initSounds () : void {

        const movingSound = new THREE.PositionalAudio( GfxCore.audioListener );
        movingSound.setBuffer( ResourceManager.getSound('tank_moving.wav') as THREE.AudioBuffer );
        movingSound.setRefDistance( 11 );
        movingSound.autoplay = false;
        this.object.add( movingSound );
        this.sounds['moving'] = movingSound;

        const explosionSound = new THREE.PositionalAudio( GfxCore.audioListener );
        explosionSound.setBuffer( ResourceManager.getSound('tank_explosion.wav') as THREE.AudioBuffer );
        explosionSound.setRefDistance( 15 );
        explosionSound.autoplay = false;
        this.object.add( explosionSound );
        this.sounds['explosion'] = explosionSound;

    };

    public toggleMovementSound ( enable: boolean ) : void {

        const sound = this.sounds['moving'];

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

    public setPosition ( position: OMath.Vec3 ) : void {

        this.object.position.x = position.x;
        this.object.position.y = position.y;
        this.object.position.z = position.z;

    };

    public shoot () : void {

        // this.mesh.playAnimation('shoot');
        this.blastSmoke.show();

    };

    public makeTankDestroyed () : void {

        // todo

    };

    private updateTracks () : void {

        const tank = this.tank;

        if ( tank.health <= 0 ) {

            return;

        }

        // if tank moves update tracks

        if ( ! this.hull.material[2] ) return;
        const track1Map = this.hull.material[1].map;
        const track2Map = this.hull.material[2].map;

        if ( Math.abs( tank.velocity ) > 20 ) {

            track1Map.offset.y = track1Map.offset.y - 0.0001 * tank.velocity;
            if ( track1Map.offset.y > 1 ) track1Map.offset.y = 0;

            track2Map.offset.y = track2Map.offset.y - 0.0001 * tank.velocity;
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

    public update ( time: number, delta: number ) : void {

        this.updateTracks();
        this.traces.update( time, delta );
        this.friendlyFireLabel.update( time, delta );
        this.damageSmoke.update( time, delta );
        this.blastSmoke.update( time, delta );

        this.cannon.update( delta / 1000 );
        this.rotateTankXAxis( this.tank.acceleration );

        // interpolate tank movement between cannon physic generated points

        let dPosX = 0;
        let dPosY = 0;
        let dPosZ = 0;
        let dRot = 0;

        if ( this.tank.health > 0 ) {

            dPosX += this.tank.directionVelocity.x * delta / 1000;
            dPosY += this.tank.directionVelocity.y * delta / 1000;
            dPosZ += this.tank.directionVelocity.z * delta / 1000;
            dRot += this.tank.angularVelocity.y * delta / 1000;

            //

            const l = this.tank.positionCorrectValue.length();
            const correctionSpeed = this.tank.isMe ? 1 : 3;

            if ( l > 0.1 ) {

                let dx = correctionSpeed * this.tank.positionCorrectValue.x / 40;
                let dy = correctionSpeed * this.tank.positionCorrectValue.y / 40;
                let dz = correctionSpeed * this.tank.positionCorrectValue.z / 40;

                dx = Math.abs( dx ) < Math.abs( this.tank.positionCorrectValue.x ) ? dx : this.tank.positionCorrectValue.x;
                dy = Math.abs( dy ) < Math.abs( this.tank.positionCorrectValue.y ) ? dy : this.tank.positionCorrectValue.y;
                dz = Math.abs( dz ) < Math.abs( this.tank.positionCorrectValue.z ) ? dz : this.tank.positionCorrectValue.z;

                dPosX += dx;
                dPosY += dy;
                dPosZ += dz;

                this.tank.positionCorrectValue.sub( dx, dy, dz );

            }

            //

            if ( Math.abs( this.tank.rotationCorrectValue ) > 0.002 ) {

                let dr = correctionSpeed * OMath.sign( this.tank.rotationCorrectValue ) / 500;
                dr = Math.abs( dr ) < Math.abs( this.tank.rotationCorrectValue ) ? dr : this.tank.rotationCorrectValue;

                dRot += dr;
                this.tank.rotationCorrectValue -= dr;

            }

        }

        //

        if ( this.hide ) {

            dPosY -= 0.7;

        }

        this.object.rotation.y += dRot;
        this.object.rotation.y = OMath.formatAngle( this.object.rotation.y );

        this.object.position.x += dPosX;
        this.object.position.y += dPosY;
        this.object.position.z += dPosZ;

        this.tank.position.copy( this.object.position );
        this.tank.rotation = this.object.rotation.y;

        this.object.updateMatrixWorld( true );

    };

    public init ( tank: TankObject ) : void {

        this.tank = tank;

        //

        let hullId = '';
        let cannonId = '';

        for ( const hullName in Game.GarageConfig.hull ) {

            if ( Game.GarageConfig.hull[ hullName ].nid === this.tank.hull.nid ) {

                hullId = Game.GarageConfig.hull[ hullName ].id;
                break;

            }

        }

        for ( const cannonName in Game.GarageConfig.cannon ) {

            if ( Game.GarageConfig.cannon[ cannonName ].nid === this.tank.cannon.nid ) {

                cannonId = Game.GarageConfig.cannon[ cannonName ].id;
                break;

            }

        }

        //

        const materials = [];
        const tankModel = ResourceManager.getModel( 'hulls/' + hullId )!;

        // add tank hull mesh

        const inMaterials = tankModel.material as THREE.MeshBasicMaterial[] || [];
        const texture = ResourceManager.getTexture( 'IS2.png' )!;

        for ( let i = 0, il = inMaterials.length; i < il; i ++ ) {

            const material = new THREE.MeshBasicMaterial({ color: 0x777777 });
            material.map = texture.clone();
            material.map.uuid = texture.uuid;
            material.map.needsUpdate = true;
            material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
            materials.push( material );

        }

        this.hull = new THREE.Mesh( tankModel.geometry, materials );
        this.hull.scale.set( 10, 10, 10 );
        this.wrapper.add( this.hull );

        // add tank cannon mesh

        const cannonModel = ResourceManager.getModel( 'cannons/' + cannonId )!;
        this.cannon = new MorphBlendMesh( cannonModel.geometry as THREE.BufferGeometry, materials );
        this.cannon.scale.set( 10, 10, 10 );
        this.wrapper.add( this.cannon );

        // add tank shadow

        const tankShadowTexture = ResourceManager.getTexture( 'Tank-shadow.png' );
        const tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }) );
        tankShadow.scale.set( 13, 20, 1 );
        tankShadow.rotation.x = - Math.PI / 2;
        tankShadow.position.y += 0.5;
        tankShadow.renderOrder = 10;
        this.object.add( tankShadow );

        //

        this.friendlyFireLabel.init( this.object );
        this.damageSmoke.init( this.object );
        this.blastSmoke.init( this.object, new OMath.Vec3( 0, 0, 5.5 ) );
        this.traces.init( this.object );
        this.label.init( this.object );
        this.label.update( this.tank.health, this.tank.armor.armor, this.tank.player.team.color, this.tank.cannon.overheat, this.tank.player.username, this.tank.isMe );
        this.initSounds();

        //

        this.object.add( this.wrapper );
        this.object.rotation.y = tank.rotation;

        //

        if ( ! GfxCore.coreObjects['tanks'] ) {

            GfxCore.coreObjects['tanks'] = new THREE.Object3D();
            GfxCore.coreObjects['tanks'].name = 'Tanks';
            GfxCore.scene.add( GfxCore.coreObjects['tanks'] );

        }

        GfxCore.coreObjects['tanks'].add( this.object );

    };

    public destroy ( callback: () => void ) : void {

        LargeExplosionManager.showExplosion( this.tank.position );
        this.sounds['explosion'].play();

        //

        setTimeout( () => {

            this.hide = true;

        }, 1500 );

        setTimeout( () => {

            callback();

        }, 3500 );

    };

    public dispose () : void {

        // dispose tank traces

        this.traces.dispose();
        this.label.dispose();

        // stop all audio

        for ( const s in this.sounds ) {

            if ( this.sounds[ s ] ) this.sounds[ s ].pause();

        }

        // remove tank object from scene

        GfxCore.coreObjects['tanks'].remove( this.object );

    };

};

//

export { TankGfx };
