/*
 * @author ohmed
 * DatTank Laser 'collision' with something effect graphics class
*/

import * as THREE from 'three';

import { GfxCore } from '../../Core.Gfx';
import { LaserShotGfx } from '../shots/LaserShot.Gfx';

//

export class LaserCollisionGfx {

    private material = {
        uniforms: {
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
                gl_FragColor = vColor.rgba;
                float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );
                gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
            }
        `,
    };

    public active: boolean = false;

    private mode: number = 0;
    private parent: LaserShotGfx;
    private object: THREE.Points;
    private particleCount: number = 200;
    private particlesVelocityVectors: THREE.Vector3[] = [];
    private particlesState: number[] = [];

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.object.visible ) return;

        const pos = ( this.object.geometry as THREE.BufferGeometry ).attributes['position'] as THREE.BufferAttribute;
        const sizes = ( this.object.geometry as THREE.BufferGeometry ).attributes['size'] as THREE.BufferAttribute;
        const colors = ( this.object.geometry as THREE.BufferGeometry ).attributes['color'] as THREE.BufferAttribute;
        let stillActive = false;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            if ( this.particlesState[ i ] === -1 ) continue;

            this.particlesState[ i ] += 1.2 * delta / 1000;
            stillActive = true;

            if ( this.particlesState[ i ] < 0 ) {

                pos.setXYZ( i, this.parent.collisionPoint.x, this.parent.collisionPoint.y, this.parent.collisionPoint.z );

            }

            if ( this.particlesState[ i ] > 1 ) {

                this.particlesState[ i ] = ( ! this.active ) ? - 1 : 0;
                pos.setXYZ( i, this.parent.collisionPoint.x, this.parent.collisionPoint.y, this.parent.collisionPoint.z );

            } else {

                let opacity = 0;
                if ( this.particlesState[ i ] > 0 ) opacity = 2 * this.particlesState[ i ];
                if ( this.particlesState[ i ] > 0.5 ) opacity = 2 * ( 1 - this.particlesState[ i ] );

                if ( this.mode === 0 ) {

                    colors.setXYZW( i, 0.2 + 2 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), 2 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), 2 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), opacity / 2 );
                    sizes.setX( i, 2 * opacity );

                    pos.setXYZ( i,
                        pos.getX( i ) + 0.3 * this.particlesVelocityVectors[ i ].x * this.particlesState[ i ],
                        pos.getY( i ) + 0.2 * this.particlesVelocityVectors[ i ].y,
                        pos.getZ( i ) + 0.3 * this.particlesVelocityVectors[ i ].z * this.particlesState[ i ],
                    );

                } else if ( this.mode === 1 ) {

                    colors.setXYZW( i, 0.2 + 0.7 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), 0.7 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), 0.0, opacity );
                    sizes.setX( i, 15 * opacity );

                    pos.setXYZ( i,
                        pos.getX( i ) + 0.6 * this.particlesVelocityVectors[ i ].x * this.particlesState[ i ],
                        pos.getY( i ) + 0.2 * this.particlesVelocityVectors[ i ].y,
                        pos.getZ( i ) + 0.6 * this.particlesVelocityVectors[ i ].z * this.particlesState[ i ],
                    );

                }

            }

        }

        if ( ! stillActive ) {

            this.object.visible = false;
            return;

        }

        pos.needsUpdate = true;
        sizes.needsUpdate = true;
        colors.needsUpdate = true;

    };

    public setActive ( mode: number ) : void {

        this.object.visible = true;
        this.active = true;
        this.mode = mode;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            this.particlesState[ i ] = ( this.particlesState[ i ] === -1 ) ? - Math.random() : this.particlesState[ i ];

        }

    };

    public deactivate () : void {

        this.active = false;

    };

    public init ( parent: LaserShotGfx ) : void {

        this.parent = parent;

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
        geometry.boundingSphere = new THREE.Sphere( new THREE.Vector3(), 10000 );

        this.object = new THREE.Points( geometry, material );
        this.object.name = 'LaserCollision';
        this.object.visible = false;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            this.particlesState[ i ] = - Math.random();
            this.particlesVelocityVectors.push( new THREE.Vector3( 1.5 * ( Math.random() - 0.5 ), 5 * Math.random(), 1.5 * ( Math.random() - 0.5 ) ) );

        }

        //

        if ( ! GfxCore.coreObjects['laserCollisions'] ) {

            GfxCore.coreObjects['laserCollisions'] = new THREE.Object3D();
            GfxCore.coreObjects['laserCollisions'].name = 'LaserCollision';
            GfxCore.scene.add( GfxCore.coreObjects['laserCollisions'] );

        }

        GfxCore.coreObjects['laserCollisions'].add( this.object );

    };

};
