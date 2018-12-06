/*
 * @author ohmed
 * Tank Laser cannon blast graphics
*/

import * as THREE from 'three';
import * as OMath from '../../../OMath/Core.OMath';

import { GfxCore } from '../../Core.Gfx';
import { LaserCollisionGfx } from '../explosions/LaserCollision.Gfx';
import { TankObject } from '../../../objects/core/Tank.Object';

//

export class LaserShotGfx {

    public active: boolean = false;
    public id: number;

    private wrapper: THREE.Object3D = new THREE.Object3D();
    private object: THREE.Object3D = new THREE.Object3D();
    private trace: THREE.Mesh;
    private range: number = 0;
    private parent: TankObject;
    public dPos: number;
    public speed: number;
    private dPosOffset: number = 0;
    private yPos: number;
    public collisionPoint: OMath.Vec3 = new OMath.Vec3();

    private intersectObjects: any;
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private collisionEffect: LaserCollisionGfx = new LaserCollisionGfx();

    //

    public update ( time: number, delta: number ) : void {

        this.collisionEffect.update( time, delta );

        if ( ! this.active ) {

            if ( this.trace.material['opacity'] <= 0 ) {

                this.object.visible = false;

            } else {

                const dz = this.speed * delta;
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

            this.raycaster.near = 40;
            this.raycaster.far = this.dPos;
            this.raycaster.ray.direction.set( Math.cos( Math.PI / 2 - this.parent.rotation ), 0, Math.sin( Math.PI / 2 - this.parent.rotation ) );
            this.raycaster.ray.origin.set( this.parent.position.x, this.yPos + this.parent.position.y, this.parent.position.z );
            const intersects = this.raycaster.intersectObjects( this.intersectObjects, true );

            //

            if ( intersects[0] ) {

                this.dPos = intersects[0].distance - this.dPosOffset;
                this.collisionPoint.set( this.parent.position.x + Math.sin( this.parent.rotation ) * this.dPos, this.yPos, this.parent.position.z + Math.cos( this.parent.rotation ) * this.dPos );
                this.collisionEffect.setActive( 1 );

            } else {

                if ( this.dPos < this.range ) {

                    const dz = this.speed * delta;
                    this.dPos += dz;

                    this.trace.position.set( 0, 0, this.dPos / 2 );
                    this.trace.scale.y = this.dPos;
                    this.trace.material['opacity'] = Math.max( 0.5 - this.trace.scale.x / 280, 0 );

                    this.trace.updateMatrixWorld( true );

                } else {

                    this.collisionPoint.set( this.parent.position.x + Math.sin( this.parent.rotation ) * this.dPos, this.yPos, this.parent.position.z + Math.cos( this.parent.rotation ) * this.dPos );
                    this.collisionEffect.setActive( 0 );

                }

            }

        }

        //

        this.wrapper.rotation.x = - this.object.parent!.parent!.rotation.x;

    };

    public deactivate () : void {

        this.active = false;
        this.collisionEffect.deactivate();

    };

    public setActive ( shotId: number, offset: number, yPos: number, range: number, shotSpeed: number, parent: TankObject ) : void {

        this.active = true;
        this.id = shotId;
        this.range = range;
        this.parent = parent;
        this.dPos = 0;
        this.dPosOffset = offset;
        this.speed = shotSpeed;
        this.yPos = yPos;

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

        this.intersectObjects = [
            GfxCore.coreObjects['tanks'],
            GfxCore.coreObjects['towers'],
            GfxCore.coreObjects['decorations'],
        ];

        this.trace = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshBasicMaterial({ color: 0xff3333, opacity: 0.5, transparent: true }) );
        this.trace.rotation.x = - Math.PI / 2;
        this.trace.renderOrder = 10;
        this.trace.scale.x = 0.4;
        this.object.visible = false;
        this.object.add( this.wrapper );
        this.wrapper.add( this.trace );

        this.collisionEffect.init( this );

    };

};
