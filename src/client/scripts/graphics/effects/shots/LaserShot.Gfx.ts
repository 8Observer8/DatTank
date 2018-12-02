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

    private object: THREE.Object3D = new THREE.Object3D();
    private trace: THREE.Mesh;
    // private sound: THREE.PositionalAudio;
    private range: number = 0;
    private parent: TankObject;
    public laserSpeed: number = 1;
    public dPos: number = 0;

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

        if ( this.dPos < this.range ) {

            const dz = this.laserSpeed * delta;
            this.dPos += dz;

            this.trace.position.set( 0, 22, this.dPos / 2 );
            this.trace.scale.y = this.dPos / 3;
            this.trace.material['opacity'] = Math.max( 0.5 - this.trace.scale.x / 280, 0 );

            this.trace.updateMatrixWorld( true );

        }

    };

    public deactivate () : void {

        this.active = false;

    };

    public setActive ( shotId: number, offset: number, range: number, directionRotation: number, parent: TankObject ) : void {

        this.active = true;
        this.id = shotId;
        this.range = range;
        this.parent = parent;
        this.dPos = offset;

        this.trace.material['opacity'] = 1;
        this.object.visible = true;

        //

        if ( this.object.parent ) {

            this.object.parent.remove( this.object );

        }

        this.parent.gfx.object.add( this.object );

    };

    public init () : void {

        this.trace = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ color: 0xff3333, opacity: 0.5, transparent: true }) );
        this.trace.rotation.x = - Math.PI / 2;
        this.trace.renderOrder = 5;
        this.trace.scale.x = 0.4;
        this.object.add( this.trace );

        this.object.visible = false;

        //

        if ( ! GfxCore.coreObjects['laserShots'] ) {

            GfxCore.coreObjects['laserShots'] = new THREE.Object3D();
            GfxCore.coreObjects['laserShots'].name = 'LaserShots';
            GfxCore.scene.add( GfxCore.coreObjects['laserShots'] );

        }

        GfxCore.coreObjects['laserShots'].add( this.object );

    };

};
