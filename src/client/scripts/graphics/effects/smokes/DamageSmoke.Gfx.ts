/*
 * @author ohmed
 * DatTank Damage smoke graphics class
*/

import * as THREE from 'three';

import { GfxCore } from '../../Core.Gfx';
import { TankObject } from '../../../objects/core/Tank.Object';
import { ParticleMaterial } from '../../utils/ParticleMaterial.Gfx';

//

export class DamageSmokeGfx {

    public active: boolean = false;

    private parent: TankObject;
    private object: THREE.Points;
    private particleCount: number = 150;
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

                pos.setXYZ( i, this.parent.position.x + 10 * ( Math.random() - 0.5 ), this.parent.position.y + 10, this.parent.position.z + 10 * ( Math.random() - 0.5 ) );

            }

            if ( this.particlesState[ i ] > 1 ) {

                this.particlesState[ i ] = ( ! this.active ) ? - 1 : 0;
                pos.setXYZ( i, this.parent.position.x + 10 * ( Math.random() - 0.5 ), this.parent.position.y + 10, this.parent.position.z + 10 * ( Math.random() - 0.5 ) );

            } else {

                let opacity = 0;
                if ( this.particlesState[ i ] > 0 ) opacity = 2 * this.particlesState[ i ];
                if ( this.particlesState[ i ] > 0.5 ) opacity = 2 * ( 1 - this.particlesState[ i ] );

                colors.setXYZW( i, 0.1 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), 0.1 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), 0.1 * Math.abs( Math.sin( 3.14 * this.particlesState[ i ] ) ), opacity / 10 );
                sizes.setX( i, 20 * opacity );

                pos.setXYZ( i,
                    pos.getX( i ) + 0.6 * this.particlesVelocityVectors[ i ].x * this.particlesState[ i ],
                    pos.getY( i ) + 0.3 * this.particlesVelocityVectors[ i ].y * this.particlesState[ i ],
                    pos.getZ( i ) + 0.6 * this.particlesVelocityVectors[ i ].z * this.particlesState[ i ],
                );

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

    public setActive () : void {

        this.object.visible = true;
        this.active = true;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            this.particlesState[ i ] = ( this.particlesState[ i ] === -1 ) ? - Math.random() : this.particlesState[ i ];

        }

    };

    public deactivate () : void {

        this.active = false;

    };

    public dispose () : void {

        GfxCore.coreObjects['laserCollisions'].remove( this.object );

    };

    public init ( parent: TankObject ) : void {

        this.parent = parent;

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
