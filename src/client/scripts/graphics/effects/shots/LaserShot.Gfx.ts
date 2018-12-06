/*
 * @author ohmed
 * Tank Laser cannon blast graphics
*/

import * as THREE from 'three';

import { GfxCore } from '../../Core.Gfx';
import { TankObject } from '../../../objects/core/Tank.Object';

//

export class LaserShotGfx {

    public active: boolean = false;
    public id: number;

    private wrapper: THREE.Object3D = new THREE.Object3D();
    private object: THREE.Object3D = new THREE.Object3D();
    private trace: THREE.Mesh;
    // private sound: THREE.PositionalAudio;
    private range: number = 0;
    private parent: TankObject;
    public laserSpeed: number = 1;
    public dPos: number = 0;
    private dPosOffset: number = 0;

    private raycaster: THREE.Raycaster = new THREE.Raycaster();

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.active ) {

            if ( this.trace.material['opacity'] <= 0 ) {

                this.object.visible = false;

            } else {

                const dz = this.laserSpeed * delta;
                this.dPos += dz;
                this.trace.position.z = this.dPos;
                this.trace.material['opacity'] -= 0.05;

            }

            return;

        }

        //

        this.raycaster['iter'] = this.raycaster['iter'] ? this.raycaster['iter'] + 1 : 1;

        if ( this.raycaster['iter'] === 3 ) {

            this.raycaster['iter'] = 0;
            this.raycaster.near = 50;
            this.raycaster.far = this.range;
            this.raycaster.ray.direction.set( Math.cos( Math.PI / 2 - this.parent.rotation ), 0, Math.sin( Math.PI / 2 - this.parent.rotation ) );
            this.raycaster.ray.origin.set( this.parent.position.x, 15, this.parent.position.z );
            const intersects = this.raycaster.intersectObjects( GfxCore.scene.children, true );

            if ( intersects.length ) {

                this.dPos = intersects[0].distance - this.dPosOffset;

            }

        } else if ( this.dPos < this.range ) {

            const dz = this.laserSpeed * delta;
            this.dPos += dz;

            this.trace.position.set( 0, 0, this.dPos / 2 );
            this.trace.scale.y = this.dPos;
            this.trace.material['opacity'] = Math.max( 0.5 - this.trace.scale.x / 280, 0 );

            this.trace.updateMatrixWorld( true );

        }

        //

        this.wrapper.rotation.x = - this.object.parent!.parent!.rotation.x;

    };

    public deactivate () : void {

        this.active = false;

    };

    public setActive ( shotId: number, offset: number, yPos: number, range: number, parent: TankObject ) : void {

        this.active = true;
        this.id = shotId;
        this.range = range;
        this.parent = parent;
        this.dPos = 0;
        this.dPosOffset = offset;

        this.trace.material['opacity'] = 1;
        this.object.visible = true;

        //

        if ( this.object.parent ) {

            this.object.parent.remove( this.object );

        }

        this.parent.gfx.cannon.add( this.object );
        this.object.position.z = offset / this.parent.gfx.cannon.scale.z;
        this.object.position.y = yPos / this.parent.gfx.cannon.scale.y;
        this.object.scale.set( 1 / this.parent.gfx.cannon.scale.x, 1 / this.parent.gfx.cannon.scale.y, 1 / this.parent.gfx.cannon.scale.z );

    };

    public init () : void {

        this.trace = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshBasicMaterial({ color: 0xff3333, opacity: 0.5, transparent: true }) );
        this.trace.rotation.x = - Math.PI / 2;
        this.trace.renderOrder = 10;
        this.trace.scale.x = 0.4;
        this.object.visible = false;
        this.object.add( this.wrapper );
        this.wrapper.add( this.trace );

    };

};
