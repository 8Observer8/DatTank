/*
 * @author ohmed
 * DatTank Bullet explosion graphics class
*/

import * as THREE from 'three';

import * as OMath from '../../../OMath/Core.OMath';
import { GfxCore } from '../../Core.Gfx';
import { ParticleMaterial } from '../../utils/ParticleMaterial.Gfx';
import { Arena } from '../../../core/Arena.Core';

//

export class ExplosionGfx {

    private object: THREE.Points;
    private time: number;
    private duration: number = 800;
    private particleCount: number = 200;
    private particlesVelocityVectors: THREE.Vector3[] = [];

    public active: boolean = false;
    private type: number = 0;

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.active ) return;
        this.time += delta;

        //

        const material = this.object.material as THREE.ShaderMaterial;
        const pos = ( this.object.geometry as THREE.BufferGeometry ).attributes['position'] as THREE.BufferAttribute;
        const sizes = ( this.object.geometry as THREE.BufferGeometry ).attributes['size'] as THREE.BufferAttribute;
        const colors = ( this.object.geometry as THREE.BufferGeometry ).attributes['color'] as THREE.BufferAttribute;
        const progress = this.time / this.duration;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            const vel = this.particlesVelocityVectors[ i ];
            sizes.setX( i, sizes.getX( i ) + 0.4 * progress );

            let coef = 0.6;
            if ( this.type === 1 ) coef = 0.9;

            if ( progress < 0.7 ) {

                pos.setXYZ( i, pos.getX( i ) + coef * vel.x * progress, pos.getY( i ) + coef * vel.y * progress, pos.getZ( i ) + coef * vel.z * progress );
                colors.setXYZ( i, colors.getX( i ) - coef * 0.002 * progress, colors.getY( i ) - 0.002 * progress, colors.getZ( i ) - 0.002 * progress );

            } else {

                pos.setXYZ( i, pos.getX( i ) - coef * vel.x * ( progress - 0.7 ) * 0.8, pos.getY( i ) - coef * vel.y * ( progress - 0.7 ) * 0.8, pos.getZ( i ) - coef * vel.z * ( progress - 0.7 ) * 0.8 );
                colors.setXYZ( i, colors.getX( i ) / 1.1, colors.getY( i ) / 1.1, colors.getZ( i ) / 1.1 );

            }

        }

        pos.needsUpdate = true;
        sizes.needsUpdate = true;
        colors.needsUpdate = true;

        if ( progress < 0.3 ) {

            material.uniforms['opacity'].value = progress / 0.3;

        } else {

            material.uniforms['opacity'].value = 1 - ( progress - 0.3 ) / 0.7;

        }

        material.uniforms['opacity'].value /= 2;

        if ( progress >= 1 ) {

            this.object.visible = false;
            this.active = false;

        }

    };

    public setActive ( position: OMath.Vec3, type: number ) : void {

        const pos = ( this.object.geometry as THREE.BufferGeometry ).attributes['position'] as THREE.BufferAttribute;
        const sizes = ( this.object.geometry as THREE.BufferGeometry ).attributes['size'] as THREE.BufferAttribute;
        const colors = ( this.object.geometry as THREE.BufferGeometry ).attributes['color'] as THREE.BufferAttribute;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            sizes.setX( i, ( Math.random() + 1 ) );

            let speedCoef: number = 0;

            if ( type === 0 ) {

                speedCoef = 1.05;
                colors.setXYZW( i, 1, 0.5 * Math.random() + 0.5, Math.random() / 3, Math.random() / 3 + 0.66 );
                this.duration = 600;

            } else {

                speedCoef = 1;
                colors.setXYZW( i, 0.9, 0.4 * Math.random() + 0.2, Math.random() / 4, Math.random() / 3 + 0.66 );
                this.duration = 1000;

            }

            const r = speedCoef * Math.random();
            const alpha = 2 * Math.PI * Math.random();
            const beta = 2 * Math.PI * Math.random();
            const y = r * Math.sin( beta );
            const rXZ = r * Math.cos( beta );
            const x = rXZ * Math.sin( alpha );
            const z = rXZ * Math.cos( alpha );

            this.particlesVelocityVectors.push( new THREE.Vector3( 1.5 * x, 1.5 * y, 1.5 * z ) );
            pos.setXYZ( i, 5 * x, 5 * y, 5 * z );

        }

        pos.needsUpdate = true;
        sizes.needsUpdate = true;
        colors.needsUpdate = true;

        this.type = type;
        this.time = 0;
        this.object.position.set( position.x, position.y, position.z );
        this.object.updateMatrixWorld( true );
        this.object.visible = true;
        this.active = true;

        //

        if ( Arena.me && Arena.me.tank ) {

            const dist = Arena.me.tank.position.distanceTo( position );

            if ( dist < 100 ) {

                GfxCore.addCameraShake( 300, 0.3 * dist / 100 );

            }

        }

    };

    public init () : void {

        const material = new ParticleMaterial();
        const geometry = new THREE.BufferGeometry();
        const points = new Float32Array( this.particleCount * 3 );
        const colors = new Float32Array( this.particleCount * 4 );
        const sizes = new Float32Array( this.particleCount * 1 );

        geometry.addAttribute( 'position', new THREE.BufferAttribute( points, 3 ) );
        geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 4 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

        this.object = new THREE.Points( geometry, material );
        this.object.name = 'Explosion';
        this.object.visible = false;
        this.object.userData.ignoreCollision = true;

        //

        if ( ! GfxCore.coreObjects['explosions'] ) {

            GfxCore.coreObjects['explosions'] = new THREE.Object3D();
            GfxCore.coreObjects['explosions'].name = 'Explosions';
            GfxCore.scene.add( GfxCore.coreObjects['explosions'] );

        }

        GfxCore.coreObjects['explosions'].add( this.object );

    };

};
