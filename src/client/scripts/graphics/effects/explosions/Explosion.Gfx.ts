/*
 * @author ohmed
 * DatTank Bullet explosion graphics class
*/

import * as THREE from 'three';

import * as OMath from '../../../OMath/Core.OMath';
import { GfxCore } from '../../Core.Gfx';

//

export class ExplosionGfx {

    private material = {
        uniforms: {
            opacity: { value: 1 },
            fogColor: { value: new THREE.Vector3() },
            fogDensity: { value: 0 },
        },
        vertexShader: `
            attribute float size;
            attribute vec4 color;
            varying vec4 vColor;
            varying float fogDepth;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                fogDepth = -mvPosition.z;
                gl_PointSize = size;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            #define whiteCompliment(a) ( 1.0 - saturate( a ) )
            const float LOG2 = 1.442695;
            uniform vec3 fogColor;
            varying float fogDepth;
            uniform float fogDensity;
            varying vec4 vColor;
            uniform float opacity;
            void main() {
                gl_FragColor = vec4( vColor.rgb, vColor.a * opacity );
                float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );
                gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
            }
        `,
    };

    private object: THREE.Points;
    private time: number;
    private duration: number = 800;
    private particleCount: number = 200;
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
            sizes.setX( i, sizes.getX( i ) * 1.06 );

            if ( progress < 0.7 ) {

                pos.setXYZ( i, pos.getX( i ) + vel.x * progress, pos.getY( i ) + vel.y * progress, pos.getZ( i ) + vel.z * progress );
                colors.setXYZ( i, colors.getX( i ) - 0.002, colors.getY( i ) - 0.002, colors.getZ( i ) - 0.002 );

            } else {

                pos.setXYZ( i, pos.getX( i ) - vel.x * ( progress - 0.7 ) * 0.8, pos.getY( i ) - vel.y * ( progress - 0.7 ) * 0.8, pos.getZ( i ) - vel.z * ( progress - 0.7 ) * 0.8 );
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

            pos.setXYZ( i, 15 * ( Math.random() - 0.5 ), 15 * ( Math.random() - 0.5 ), 15 * ( Math.random() - 0.5 ) );
            sizes.setX( i, ( Math.random() + 1 ) );

            if ( type === 0 ) {

                colors.setXYZW( i, 1, 0.5 * Math.random() + 0.5, Math.random() / 3, Math.random() / 3 + 0.66 );
                this.particlesVelocityVectors.push( new THREE.Vector3( 1.5 * ( Math.random() - 0.5 ), 1.5 *  ( Math.random() - 0.5 ), 1.5 * ( Math.random() - 0.5 ) ) );
                this.duration = 600;

            } else {

                colors.setXYZW( i, 0.9, 0.4 * Math.random() + 0.2, Math.random() / 4, Math.random() / 3 + 0.66 );
                this.particlesVelocityVectors.push( new THREE.Vector3( 1 * ( Math.random() - 0.5 ), 1 *  ( Math.random() - 0.5 ), 1 * ( Math.random() - 0.5 ) ) );
                this.duration = 1000;

            }

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

        const material = new THREE.ShaderMaterial( {
            uniforms: this.material.uniforms,
            vertexShader: this.material.vertexShader,
            fragmentShader: this.material.fragmentShader,
            transparent: true,
            depthWrite: false,
            fog: true,
        });

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

        //

        if ( ! GfxCore.coreObjects['explosions'] ) {

            GfxCore.coreObjects['explosions'] = new THREE.Object3D();
            GfxCore.coreObjects['explosions'].name = 'Explosions';
            GfxCore.scene.add( GfxCore.coreObjects['explosions'] );

        }

        GfxCore.coreObjects['explosions'].add( this.object );

    };

};