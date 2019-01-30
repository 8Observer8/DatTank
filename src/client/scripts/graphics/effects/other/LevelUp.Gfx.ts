/*
 * @author ohmed
 * DatTank Tank levelUp graphics class
*/

import * as THREE from 'three';

import { GfxCore } from '../../Core.Gfx';
import { ParticleMaterial } from '../../utils/ParticleMaterial.Gfx';

//

export class LevelUpGfx {

    public active: boolean = false;

    private target: THREE.Object3D;
    private object: THREE.Points;
    private particleCount: number = 350;
    private particlesVelocityVectors: THREE.Vector3[] = [];
    private particlesState: number[] = [];
    private time: number = 0;

    //

    public isActive () : boolean {

        return ( this.object.visible === true );

    };

    public dispose () : void {

        if ( ! GfxCore.coreObjects['level-up'] || ! this.object ) return;
        GfxCore.coreObjects['level-up'].remove( this.object );

    };

    public activate ( target: THREE.Object3D, level: number ) : void {

        this.time = 0;
        this.target = target;
        this.object.visible = true;
        this.active = true;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            this.particlesState[ i ] = - Math.random();

        }

    };

    public deactivate () : void {

        this.active = false;

    };

    public update ( time: number, delta: number ) : void {

        if ( ! this.object.visible ) return;

        //

        this.time += delta;
        if ( this.time > 1000 ) this.deactivate();

        const pos = ( this.object.geometry as THREE.BufferGeometry ).attributes['position'] as THREE.BufferAttribute;
        const sizes = ( this.object.geometry as THREE.BufferGeometry ).attributes['size'] as THREE.BufferAttribute;
        const colors = ( this.object.geometry as THREE.BufferGeometry ).attributes['color'] as THREE.BufferAttribute;
        let stillActive = false;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            if ( this.particlesState[ i ] === -1 ) continue;

            this.particlesState[ i ] += 0.4 * delta / 1000;
            stillActive = true;

            if ( this.particlesState[ i ] < 0 ) {

                pos.setXYZ( i, this.target.position.x + ( Math.random() - 0.5 ) * 40, this.target.position.y + 4, this.target.position.z + ( Math.random() - 0.5 ) * 40 );

            }

            if ( this.particlesState[ i ] > 1 ) {

                this.particlesState[ i ] = ( ! this.active ) ? - 1 : 0;
                pos.setXYZ( i, this.target.position.x, this.target.position.y, this.target.position.z );

            } else {

                let opacity = 0;
                if ( this.particlesState[ i ] > 0 ) opacity = this.particlesState[ i ];
                if ( this.particlesState[ i ] > 0.5 ) opacity = ( 1 - this.particlesState[ i ] );

                colors.setXYZW( i, 1, 1, 1, 0.8 * opacity );
                sizes.setX( i, 10 * opacity );

                pos.setXYZ( i,
                    pos.getX( i ) + 3.5 * this.particlesVelocityVectors[ i ].x * Math.sin( 6 * Math.PI * this.particlesState[ i ] ) * this.particlesState[ i ],
                    pos.getY( i ) + 0.1 * this.particlesVelocityVectors[ i ].y * this.particlesState[ i ],
                    pos.getZ( i ) + 3.5 * this.particlesVelocityVectors[ i ].z * Math.cos( 6 * Math.PI * this.particlesState[ i ] ) * this.particlesState[ i ],
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
        this.object.name = 'LevelUpEffect';
        this.object.visible = false;
        this.object.userData.ignoreCollision = true;

        for ( let i = 0, il = this.particleCount; i < il; i ++ ) {

            this.particlesState[ i ] = - 0.2 * Math.random();
            this.particlesVelocityVectors.push( new THREE.Vector3( 1.5 * ( Math.random() - 0.5 ), 15 * Math.random(), 1.5 * ( Math.random() - 0.5 ) ) );

        }

        //

        if ( ! GfxCore.coreObjects['level-up'] ) {

            GfxCore.coreObjects['level-up'] = new THREE.Object3D();
            GfxCore.coreObjects['level-up'].name = 'TankTraces';
            GfxCore.scene.add( GfxCore.coreObjects['level-up'] );

        }

        GfxCore.coreObjects['level-up'].add( this.object );

    };

};
