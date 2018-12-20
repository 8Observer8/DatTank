/*
 * @author ohmed
 * DatTank Bullet explosion graphics class
*/

import * as THREE from 'three';

import * as OMath from '../../../OMath/Core.OMath';
import { GfxCore } from '../../Core.Gfx';
import { ParticleMaterial } from '../../utils/ParticleMaterial.Gfx';

//

export class DeathExplosionGfx {

    private object: THREE.Points;
    private time: number;
    private duration: number = 2500;
    private particleCount: number = 400;
    private particlesVelocityVectors: THREE.Vector3[] = [];

    public active: boolean = false;

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

            if ( progress < 0.4 ) {

                pos.setXYZ( i, pos.getX( i ) + vel.x * delta / 16, pos.getY( i ) + vel.y * delta / 16, pos.getZ( i ) + vel.z * delta / 16 );
                colors.setXYZ( i, colors.getX( i ) - 0.002 * progress, colors.getY( i ) - 0.002 * progress, colors.getZ( i ) - 0.002 * progress );
                sizes.setX( i, sizes.getX( i ) + 0.4 * progress );

            } else {

                pos.setXYZ( i, pos.getX( i ) + 0.2 * vel.x * delta / 16, pos.getY( i ) - 0.1 * delta / 16, pos.getZ( i ) + 0.2 * vel.z * delta / 16 );
                colors.setXYZ( i, colors.getX( i ) / 1.1, colors.getY( i ) / 1.1, colors.getZ( i ) / 1.1 );
                sizes.setX( i, sizes.getX( i ) - 0.4 * progress );

            }

        }

        pos.needsUpdate = true;
        sizes.needsUpdate = true;
        colors.needsUpdate = true;

        if ( progress < 0.5 ) {

            material.uniforms['opacity'].value = progress / 0.5;

        } else {

            material.uniforms['opacity'].value = 1 - ( progress - 0.5 ) / 0.5;

        }

        material.uniforms['opacity'].value /= 2;

        if ( progress >= 1 ) {

            this.object.visible = false;
            this.active = false;

        }

    };

    public setActive ( position: OMath.Vec3 ) : void {

        const pos = ( this.object.geometry as THREE.BufferGeometry ).attributes['position'] as THREE.BufferAttribute;
        const sizes = ( this.object.geometry as THREE.BufferGeometry ).attributes['size'] as THREE.BufferAttribute;
        const colors = ( this.object.geometry as THREE.BufferGeometry ).attributes['color'] as THREE.BufferAttribute;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            pos.setXYZ( i, 0, 0, 0 );
            sizes.setX( i, ( Math.random() + 1 ) );

            colors.setXYZW( i, 1, 0.5 * Math.random() + 0.5, Math.random() / 3, Math.random() / 3 + 0.66 );

            const r = 0.8 * Math.random();
            const alpha = 2 * Math.PI * Math.random();
            const beta = 2 * Math.PI * Math.random();
            const y = r * Math.abs( Math.sin( beta ) );
            const rXZ = r * Math.abs( Math.cos( beta ) );
            const x = rXZ * Math.sin( alpha );
            const z = rXZ * Math.cos( alpha );

            this.particlesVelocityVectors.push( new THREE.Vector3( x, y, z ) );

        }

        pos.needsUpdate = true;
        sizes.needsUpdate = true;
        colors.needsUpdate = true;

        this.time = 0;
        this.object.position.set( position.x, position.y, position.z );
        this.object.updateMatrixWorld( true );
        this.object.visible = true;
        this.active = true;

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
        this.object.renderOrder = 1;
        this.object.userData.ignoreCollision = true;

        //

        if ( ! GfxCore.coreObjects['deathExplosions'] ) {

            GfxCore.coreObjects['deathExplosions'] = new THREE.Object3D();
            GfxCore.coreObjects['deathExplosions'].name = 'DeathExplosions';
            GfxCore.scene.add( GfxCore.coreObjects['deathExplosions'] );

        }

        GfxCore.coreObjects['deathExplosions'].add( this.object );

    };

};
