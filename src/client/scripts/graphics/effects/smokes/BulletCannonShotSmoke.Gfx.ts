/*
 * @author ohmed
 * DatTank 'bullet' cannon 'shot' smoke effect effect graphics class
*/

import * as THREE from 'three';
import * as OMath from '../../../OMath/Core.OMath';

import { ParticleMaterial } from '../../utils/ParticleMaterial.Gfx';
import { GfxCore } from '../../Core.Gfx';

//

export class BulletCannonShotSmoke {

    public active: boolean = false;

    private animate: boolean = false;
    private direction: OMath.Vec3;
    private position: OMath.Vec3 = new OMath.Vec3();
    private object: THREE.Points;
    private particleCount: number = 250;
    private particlesVelocityVectors: THREE.Vector3[] = [];
    private particlesState: number[] = [];
    private time: number = 0;

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.object.visible ) return;

        this.time += delta;
        if ( this.time > 100 ) {

            this.deactivate();

        }

        const pos = ( this.object.geometry as THREE.BufferGeometry ).attributes['position'] as THREE.BufferAttribute;
        const sizes = ( this.object.geometry as THREE.BufferGeometry ).attributes['size'] as THREE.BufferAttribute;
        const colors = ( this.object.geometry as THREE.BufferGeometry ).attributes['color'] as THREE.BufferAttribute;
        let stillActive = false;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            if ( this.particlesState[ i ] === -1 ) continue;

            this.particlesState[ i ] += 2 * delta / 1000;
            stillActive = true;

            if ( this.particlesState[ i ] < 0 ) {

                pos.setXYZ( i, this.position.x, this.position.y, this.position.z );

            }

            if ( this.particlesState[ i ] > 1 ) {

                this.particlesState[ i ] = ( ! this.animate ) ? - 1 : 0;
                pos.setXYZ( i, this.position.x, this.position.y, this.position.z );

            } else {

                let opacity = this.particlesState[ i ];
                if ( this.particlesState[ i ] > 0.1 ) opacity = 2 * this.particlesState[ i ];
                if ( this.particlesState[ i ] > 0.3 ) opacity = ( 1 - this.particlesState[ i ] );

                colors.setXYZW( i, 0.1 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), 0.1 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), 0.1 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), opacity / 5 );
                sizes.setX( i, 20 * opacity );

                pos.setXYZ( i,
                    pos.getX( i ) + this.particlesVelocityVectors[ i ].x * ( 1 - Math.pow( this.particlesState[ i ], 2 ) ),
                    pos.getY( i ) + this.particlesVelocityVectors[ i ].y * ( 1 - Math.pow( this.particlesState[ i ], 2 ) ),
                    pos.getZ( i ) + this.particlesVelocityVectors[ i ].z * ( 1 - Math.pow( this.particlesState[ i ], 2 ) ),
                );

            }

        }

        if ( ! stillActive ) {

            this.object.visible = false;
            this.active = false;
            return;

        }

        pos.needsUpdate = true;
        sizes.needsUpdate = true;
        colors.needsUpdate = true;

    };

    public setActive ( position: OMath.Vec3 | THREE.Vector3, rotation: number ) : void {

        this.object.visible = true;
        this.active = true;
        this.animate = true;
        this.position.copy( position );
        this.direction = new OMath.Vec3( 3 * Math.sin( rotation ), 2, 3 * Math.cos( rotation ) );
        this.time = 0;
        this.particlesVelocityVectors = [];

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            this.particlesState[ i ] = - 0.5 * Math.random();
            this.particlesVelocityVectors.push( new THREE.Vector3( 1 * ( Math.random() - 0.5 ) + this.direction.x, ( Math.random() - 0.5 ) * this.direction.y, 1 * ( Math.random() - 0.5 ) + this.direction.z ) );

        }

    };

    public deactivate () : void {

        this.animate = false;

    };

    public dispose () : void {

        GfxCore.coreObjects['BulletCannonShotSmoke'].remove( this.object );

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
        geometry.boundingSphere = new THREE.Sphere( new THREE.Vector3(), 10000 );

        this.object = new THREE.Points( geometry, material );
        this.object.name = 'LaserCollision';
        this.object.visible = false;
        this.object.userData.ignoreCollision = true;

        //

        if ( ! GfxCore.coreObjects['BulletCannonShotSmoke'] ) {

            GfxCore.coreObjects['BulletCannonShotSmoke'] = new THREE.Object3D();
            GfxCore.coreObjects['BulletCannonShotSmoke'].name = 'LaserCollision';
            GfxCore.scene.add( GfxCore.coreObjects['BulletCannonShotSmoke'] );

        }

        GfxCore.coreObjects['BulletCannonShotSmoke'].add( this.object );

    };

};
