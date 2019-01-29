/*
 * @author ohmed
 * Tank Laser cannon blast graphics
*/

import * as THREE from 'three';
import * as OMath from '../../../OMath/Core.OMath';

import { GfxCore } from '../../Core.Gfx';
import { ResourceManager } from '../../../managers/other/Resource.Manager';
import { LaserCollisionGfx } from '../explosions/LaserCollision.Gfx';
import { TankObject } from '../../../objects/core/Tank.Object';

//

export class LaserShotGfx {

    public active: boolean = false;
    public id: number;

    private wrapper: THREE.Object3D = new THREE.Object3D();
    private object: THREE.Object3D = new THREE.Object3D();
    private trace: THREE.Mesh;
    private sound: THREE.PositionalAudio;
    private range: number = 0;
    private parent: TankObject;
    public dPos: number;
    public speed: number;
    private offset: OMath.Vec3;
    private target: any;
    public collisionPoint: OMath.Vec3 = new OMath.Vec3();
    private collisionEffect: LaserCollisionGfx = new LaserCollisionGfx();

    private raycastIteration: number = 0;

    //

    public update ( time: number, delta: number ) : void {

        this.collisionEffect.update( time, delta );

        if ( ! this.active ) {

            if ( this.trace.material['opacity'] <= 0 ) {

                this.object.visible = false;
                this.collisionEffect.deactivate();
                return;

            } else {

                const dz = this.speed * delta;
                this.dPos += dz;
                this.trace.position.z = this.dPos;
                this.trace.material['opacity'] -= 0.05;

            }

        }

        //

        this.raycastIteration ++;

        if ( this.raycastIteration === 3 ) {

            this.raycastIteration = 0;

            const position = new THREE.Vector3( this.offset.x, this.offset.y, this.offset.z );
            position.applyEuler( this.parent.gfx.object.rotation );
            position.add( this.parent.gfx.object.position );

            const intersects = GfxCore.intersectManager.getIntersection( position, Math.PI / 2 - this.parent.rotation, this.dPos );

            //

            this.target = false;

            for ( let i = 0, il = intersects.length; i < il; i ++ ) {

                if ( intersects[ i ].object.userData.ignoreCollision === true ) continue;

                this.target = intersects[ i ].object;
                this.dPos = intersects[ i ].distance;
                this.collisionPoint.copy( intersects[ i ].point );
                this.collisionEffect.setActive( 1 );
                break;

            }

        }

        if ( ! this.target ) {

            if ( this.dPos < this.range ) {

                const dz = this.speed * delta;
                this.dPos += dz;

            } else {

                const position = new THREE.Vector3( this.offset.x, this.offset.y, this.offset.z );
                position.applyEuler( this.parent.gfx.object.rotation );
                position.add( this.parent.gfx.object.position );

                this.collisionPoint.set( position.x + Math.sin( this.parent.rotation ) * this.dPos, position.y, position.z + Math.cos( this.parent.rotation ) * this.dPos );
                this.collisionEffect.setActive( 0 );

            }

        }

        //

        if ( this.active ) {

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
        this.collisionEffect.deactivate();
        this.sound.stop();

    };

    public setActive ( shotId: number, offset: OMath.Vec3, range: number, shotSpeed: number, parent: TankObject ) : void {

        this.sound.setBuffer( ResourceManager.getSound('tank_laser.wav') as THREE.AudioBuffer );
        this.sound.loop = true;
        this.sound.play();

        this.active = true;
        this.id = shotId;
        this.range = range;
        this.parent = parent;
        this.dPos = 0;
        this.speed = shotSpeed;
        this.offset = offset;

        this.trace.material['opacity'] = 1;
        this.object.visible = true;

        //

        if ( this.object.parent ) {

            this.object.parent.remove( this.sound );
            this.object.parent.remove( this.object );

        }

        //

        this.parent.gfx.cannon.add( this.object );
        this.parent.gfx.cannon.add( this.sound );

        this.object.position.x = this.offset.x / this.parent.gfx.cannon.scale.x;
        this.object.position.y = this.offset.y / this.parent.gfx.cannon.scale.y;
        this.object.position.z = this.offset.z / this.parent.gfx.cannon.scale.z;
        this.sound.position.set( - this.object.position.x / this.parent.gfx.cannon.scale.x, 0, - this.object.position.z / this.parent.gfx.cannon.scale.z );

        this.object.scale.set( 1 / this.parent.gfx.cannon.scale.x, 1 / this.parent.gfx.cannon.scale.y, 1 / this.parent.gfx.cannon.scale.z );

    };

    public init () : void {

        this.sound = new THREE.PositionalAudio( GfxCore.audioListener );
        this.sound.setRefDistance( 100 );
        this.sound.setVolume( 0.5 );
        this.sound.autoplay = false;

        this.trace = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshBasicMaterial({ color: 0xff3333, opacity: 0.5, transparent: true }) );
        this.trace.rotation.x = - Math.PI / 2;
        this.trace.renderOrder = 10;
        this.trace.scale.x = 0.8;
        this.trace.userData.ignoreCollision = true;
        this.object.visible = false;
        this.object.add( this.wrapper );
        this.wrapper.add( this.trace );

        this.collisionEffect.init( this );

    };

};
