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
    private base: THREE.Mesh;
    private cannon: MorphBlendMesh;
    private tank: TankObject;
    private traces: TankTracesGfx = new TankTracesGfx();
    public label: TankLabelGfx = new TankLabelGfx();
    public friendlyFireLabel: FriendlyFireLabelGfx = new FriendlyFireLabelGfx();
    public damageSmoke: DamageSmokeGfx = new DamageSmokeGfx();
    public blastSmoke: BlastSmokeGfx = new BlastSmokeGfx();

    private prevDRotVal: number = 0;
    private prevDPosVal: OMath.Vec3 = new OMath.Vec3();
    private prevPos: OMath.Vec3 = new OMath.Vec3();
    private prevRot: number = 0;

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

    public setRotation ( angle: number ) : void {

        // this.object.rotation.y = angle;

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

        if ( ! this.base.material[2] ) return;
        const track1Map = this.base.material[1].map;
        const track2Map = this.base.material[2].map;

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

        // interpolate tank movement between cannon physic generated points

        let dPosX = 0;
        let dPosY = 0;
        let dPosZ = 0;
        let dRot = 0;

        if ( this.tank.deltaPosChange > 1 ) {

            const d = ( delta > this.tank.deltaPosChange ) ? this.tank.deltaPosChange : delta;
            const dx = ( this.tank.possCorrect2.x * d + this.prevDPosVal.x ) / 5;
            const dy = ( this.tank.possCorrect2.y * d + this.prevDPosVal.y ) / 5;
            const dz = ( this.tank.possCorrect2.z * d + this.prevDPosVal.z ) / 5;
            this.prevDPosVal.set( dx, dy, dz );

            dPosX += dx;
            dPosY += dy;
            dPosZ += dz;

            this.tank.deltaPosChange -= d;

        }

        const l = Math.sqrt( this.tank.possCorrect1.x * this.tank.possCorrect1.x + this.tank.possCorrect1.z * this.tank.possCorrect1.z );

        if ( l > 0.5 ) {

            const dcx1 = ( this.tank.possCorrect1.x / l ) / 3;
            const dcy1 = ( this.tank.possCorrect1.y / l ) / 3;
            const dcz1 = ( this.tank.possCorrect1.z / l ) / 3;

            dPosX += dcx1;
            dPosY += dcy1;
            dPosZ += dcz1;

            this.tank.possCorrect1.x -= dcx1;
            this.tank.possCorrect1.y -= dcy1;
            this.tank.possCorrect1.z -= dcz1;

        }

        // //

        if ( this.tank.deltaRotChange > 1 ) {

            const d = ( delta > this.tank.deltaRotChange ) ? this.tank.deltaRotChange : delta;
            const dr = ( this.tank.rotCorrect2 * d + this.prevDRotVal ) / 2;
            this.prevDRotVal = dr;

            dRot = dr;
            if ( this.object.rotation.y > Math.PI ) this.object.rotation.y -= 2 * Math.PI;
            if ( this.object.rotation.y < - Math.PI ) this.object.rotation.y += 2 * Math.PI;
            this.tank.deltaRotChange -= d;

        }

        if ( this.tank.rotCorrect1 > 0.01 ) {

            let dcr = Math.sign( this.tank.rotCorrect1 ) / 200;
            dcr = ( Math.abs( dcr ) < Math.abs( this.tank.rotCorrect1 ) ) ? dcr : this.tank.rotCorrect1;

            dRot += dcr;
            this.tank.rotCorrect1 -= dcr;

        }

        //

        if ( this.hide ) {

            dPosY -= 0.7;

        }

        this.object.rotation.y = this.prevRot + dRot;
        if ( this.object.rotation.y > Math.PI ) this.object.rotation.y -= 2 * Math.PI;
        if ( this.object.rotation.y < - Math.PI ) this.object.rotation.y += 2 * Math.PI;

        this.object.position.x = this.object.position.x + dPosX;
        this.object.position.y = this.object.position.y + dPosY;
        this.object.position.z = this.object.position.z + dPosZ;

        this.prevPos.copy( this.object.position );
        this.prevRot = this.object.rotation.y;

        this.object.updateMatrixWorld( true );

    };

    public init ( tank: TankObject ) : void {

        this.tank = tank;

        //

        let baseId = '';
        let cannonId = '';

        for ( const tankName in Game.GarageConfig.tanks ) {

            if ( Game.GarageConfig.tanks[ tankName ].nid === this.tank.base.nid ) {

                baseId = Game.GarageConfig.tanks[ tankName ].id;
                break;

            }

        }

        for ( const cannonName in Game.GarageConfig.cannons ) {

            if ( Game.GarageConfig.cannons[ cannonName ].nid === this.tank.cannon.nid ) {

                cannonId = Game.GarageConfig.cannons[ cannonName ].id;
                break;

            }

        }

        //

        const materials = [];
        const tankModel = ResourceManager.getModel( 'bases/' + baseId )!;

        // add tank base mesh

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

        this.base = new THREE.Mesh( tankModel.geometry, materials );
        this.base.scale.set( 10, 10, 10 );
        this.wrapper.add( this.base );

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

        this.prevPos.copy( this.object.position );
        this.prevRot = this.object.rotation.y;

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
