/*
 * @author ohmed
 * DatTank Tank graphics class
*/

import * as THREE from 'three';
import { MorphBlendMesh } from '../utils/MorphMesh.Gfx';

import * as OMath from '../../OMath/Core.OMath';
import { GfxCore } from '../Core.Gfx';
import { TankLabelGfx } from '../effects/labels/TankLabel.Gfx';
import { TankObject } from '../../objects/core/Tank.Object';
import { ResourceManager } from '../../managers/other/Resource.Manager';
import { TankTracesGfx } from '../effects/other/TankTraces.Gfx';
import { DeathExplosionManager } from '../managers/DeathExplosion.Manager';
import { FriendlyFireLabelGfx } from '../effects/labels/FriendlyFireLabel.Gfx';
import { DamageSmokeGfx } from '../effects/smokes/DamageSmoke.Gfx';
import { BlastSmokeGfx } from '../effects/smokes/BlastSmoke.Gfx';
import { Game } from '../../Game';

//

class TankGfx {

    public wrapper: THREE.Object3D = new THREE.Object3D();
    public object: THREE.Object3D = new THREE.Object3D();
    public hull: THREE.Mesh;
    public cannon: MorphBlendMesh;
    public tank: TankObject;
    public traces: TankTracesGfx = new TankTracesGfx();
    public label: TankLabelGfx = new TankLabelGfx();
    public friendlyFireLabel: FriendlyFireLabelGfx = new FriendlyFireLabelGfx();
    public damageSmoke: DamageSmokeGfx = new DamageSmokeGfx();
    public blastSmoke: BlastSmokeGfx = new BlastSmokeGfx();
    public shadow: THREE.Mesh;
    public movingSound: THREE.PositionalAudio;
    public explosionSound: THREE.PositionalAudio;

    private hide: boolean = false;
    private rotateTankTime: number = 0;

    //

    public rotateTankXAxis ( delta: number ) : void {

        this.wrapper.rotation.x += this.tank.acceleration * delta / 16;
        this.rotateTankTime += delta;

        for ( let i = 0, il = Math.floor( this.rotateTankTime / 16 ); i < il; i ++ ) {

            this.wrapper.rotation.x *= 0.95;
            this.rotateTankTime -= 16;

        }

    };

    private initSounds () : void {

        this.movingSound = new THREE.PositionalAudio( GfxCore.audioListener );
        this.movingSound.setBuffer( ResourceManager.getSound('tank_moving.wav') as THREE.AudioBuffer );
        this.movingSound.setRefDistance( 5 );
        this.movingSound.autoplay = false;
        this.object.add( this.movingSound );

        this.explosionSound = new THREE.PositionalAudio( GfxCore.audioListener );
        this.explosionSound.setBuffer( ResourceManager.getSound('tank_explosion.wav') as THREE.AudioBuffer );
        this.explosionSound.setRefDistance( 15 );
        this.explosionSound.autoplay = false;
        this.object.add( this.explosionSound );

    };

    public toggleMovementSound ( enable: boolean ) : void {

        if ( this.movingSound.buffer ) {

            if ( ! this.movingSound.isPlaying && enable ) {

                this.movingSound.play();
                this.movingSound.isPlaying = true;

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

    private updateTracks ( time: number, delta: number ) : void {

        const tank = this.tank;

        if ( tank.health <= 0 ) {

            return;

        }

        // if tank moves update tracks

        if ( ! this.hull.material[2] ) return;
        const track1Map = this.hull.material[1].map;
        const track2Map = this.hull.material[2].map;

        if ( Math.abs( tank.velocity ) > 20 ) {

            track1Map.offset.y = track1Map.offset.y - 0.00006 * tank.velocity * delta / 16;
            if ( track1Map.offset.y > 1 ) track1Map.offset.y = 0;

            track2Map.offset.y = track2Map.offset.y - 0.00006 * tank.velocity * delta / 16;
            if ( track2Map.offset.y > 1 ) track2Map.offset.y = 0;

        } else if ( tank.moveDirection.y === -1 ) {

            track1Map.offset.y = track1Map.offset.y - 0.005 * delta / 16;
            if ( track1Map.offset.y > 1 ) track1Map.offset.y = 0;

            track2Map.offset.y = track2Map.offset.y + 0.005 * delta / 16;
            if ( track2Map.offset.y > 1 ) track2Map.offset.y = 0;

        } else if ( tank.moveDirection.y === 1 ) {

            track1Map.offset.y = track1Map.offset.y + 0.005 * delta / 16;
            if ( track1Map.offset.y > 1 ) track1Map.offset.y = 0;

            track2Map.offset.y = track2Map.offset.y - 0.005 * delta / 16;
            if ( track2Map.offset.y > 1 ) track2Map.offset.y = 0;

        }

    };

    public update ( time: number, delta: number ) : void {

        if ( ! this.tank ) return;

        if ( this.tank.health <= 0 && ! this.tank.isMe ) {

            this.label.update( this.tank.health, this.tank.armor.armor, this.tank.player.team.color, this.tank.player.username );

        }

        //

        this.movingSound.setVolume( this.tank.velocity / 40 );

        this.updateTracks( time, delta );
        this.traces.update( time, delta );
        this.friendlyFireLabel.update( time, delta );
        this.damageSmoke.update( time, delta );
        this.blastSmoke.update( time, delta );

        this.cannon.update( delta / 1000 );
        this.rotateTankXAxis( delta );

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
            const correctionSpeed = ( delta / 16 ) * ( this.tank.isMe ? 1 : 4 );

            if ( l > 0.5 ) {

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

            if ( Math.abs( this.tank.rotationCorrectValue ) > 0.01 ) {

                let dr = correctionSpeed * OMath.sign( this.tank.rotationCorrectValue ) / 100;
                dr = Math.abs( dr ) < Math.abs( this.tank.rotationCorrectValue ) ? dr : this.tank.rotationCorrectValue;

                dRot += dr;
                this.tank.rotationCorrectValue -= dr;

            }

        }

        //

        if ( this.hide ) {

            dPosY -= 0.7 * delta / 16;

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

        const inMaterials = tankModel.material as THREE.MeshLambertMaterial[] || [];
        const texture = ResourceManager.getTexture( 'tanks/hulls/' + hullId + '.jpg' )!;

        for ( let i = 0, il = inMaterials.length; i < il; i ++ ) {

            const material = new THREE.MeshLambertMaterial({ color: OMath.intToHex( OMath.darkerColor( this.tank.player.team.color, 1.4 ) ) });
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
        this.cannon = new MorphBlendMesh( cannonModel.geometry as THREE.BufferGeometry, [ new THREE.MeshLambertMaterial({ color: OMath.intToHex( OMath.darkerColor( this.tank.player.team.color, 1.4 ) ), map: ResourceManager.getTexture( 'tanks/cannons/' + cannonId + '.jpg' )! }) ] );
        this.cannon.scale.set( 10, 10, 10 );
        this.wrapper.add( this.cannon );

        // add tank shadow

        const tankShadowTexture = ResourceManager.getTexture( 'Tank-shadow.png' );
        const tankShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: tankShadowTexture, transparent: true, depthWrite: false, opacity: 0.7 }) );
        tankShadow.scale.set( 13, 20, 1 );
        tankShadow.rotation.x = - Math.PI / 2;
        tankShadow.position.y += 0.5;
        tankShadow.renderOrder = 10;
        this.shadow = tankShadow;
        this.object.add( tankShadow );

        //

        this.friendlyFireLabel.init( this.object );
        this.damageSmoke.init( this.tank );
        this.blastSmoke.init( this.object, new OMath.Vec3( 0, 0, 5.5 ) );
        this.traces.init( this.object );

        if ( ! this.tank.isMe ) {

            this.label.init( this.object );
            this.label.update( this.tank.health, this.tank.armor.armor, this.tank.player.team.color, this.tank.player.username );

        }

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

        DeathExplosionManager.showExplosion( this.tank.position );
        this.explosionSound.play();

        this.traces.hide();

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
        this.damageSmoke.dispose();

        // stop all audio

        if ( this.explosionSound ) this.explosionSound.pause();
        if ( this.movingSound ) this.movingSound.pause();

        // remove tank object from scene

        GfxCore.coreObjects['tanks'].remove( this.object );

    };

};

//

export { TankGfx };
