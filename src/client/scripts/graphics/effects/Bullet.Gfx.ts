/*
 * @author ohmed
 * DatTank Default bullet graphics class
*/

import * as THREE from 'three';

import * as OMath from '../../OMath/Core.OMath';
import { GfxCore } from '../Core.Gfx';
import { ResourceManager } from '../../managers/Resource.Manager';

//

export class BulletGfx {

    public active: boolean = false;
    public id: number;

    private object: THREE.Object3D = new THREE.Object3D();
    private trace: THREE.Mesh;
    private bullet: THREE.Mesh;
    private sound: THREE.PositionalAudio;
    private time: number = 0;
    private flightDuration: number = 220;

    private directionRotation: number;
    private position: OMath.Vec3 = new OMath.Vec3();
    private bulletSpeed: number = 1.8;

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.active ) return;
        this.time += delta;

        let x;
        let z;
        let dx;
        let dz;

        x = this.bullet.position.x + this.bulletSpeed * Math.cos( this.directionRotation ) * delta;
        z = this.bullet.position.z + this.bulletSpeed * Math.sin( this.directionRotation ) * delta;
        this.bullet.position.set( x, this.bullet.position.y, z );

        this.trace.position.set( ( x + this.position.x ) / 2, this.position.y, ( z + this.position.z ) / 2 );
        dx = x - this.position.x;
        dz = z - this.position.z;
        this.trace.scale.x = Math.sqrt( dx * dx + dz * dz ) / 3;
        this.trace.material['opacity'] = Math.max( 0.5 - this.trace.scale.x / 280, 0 );

        this.object.updateMatrixWorld( true );

        //

        if ( this.time > this.flightDuration ) {

            this.deactivate();

        }

    };

    public deactivate () : void {

        this.object.visible = false;
        this.active = false;

    };

    public setActive ( bulletId: number, position: OMath.Vec3, directionRotation: number ) : void {

        this.active = true;
        this.id = bulletId;
        this.time = 0;
        this.object.visible = true;
        this.position.copy( position );
        this.bullet.position.set( this.position.x, this.position.y, this.position.z );
        this.directionRotation = directionRotation;
        this.trace.rotation.z = - directionRotation;

        //

        if ( this.sound.isPlaying ) {

            this.sound.stop();
            this.sound.startTime = 0;
            this.sound.isPlaying = false;

        }

        this.sound.play();

    };

    public init () : void {

        this.bullet = new THREE.Mesh( new THREE.BoxGeometry( 2.5, 2.5, 2.5 ), new THREE.MeshBasicMaterial({ color: 0xff3333 }) );
        this.object.add( this.bullet );

        this.trace = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true }) );
        this.trace.rotation.x = - Math.PI / 2;
        this.trace.renderOrder = 5;
        this.object.add( this.trace );

        this.sound = new THREE.PositionalAudio( GfxCore.audioListener );
        this.sound.setBuffer( ResourceManager.getSound('tank_shooting.wav') as THREE.AudioBuffer );
        this.sound.setRefDistance( 70 );
        this.sound.autoplay = false;
        this.object.add( this.sound );

        this.object.visible = false;

        //

        if ( ! GfxCore.coreObjects['bullets'] ) {

            GfxCore.coreObjects['bullets'] = new THREE.Object3D();
            GfxCore.coreObjects['bullets'].name = 'Bullets';
            GfxCore.scene.add( GfxCore.coreObjects['bullets'] );

        }

        GfxCore.coreObjects['bullets'].add( this.object );

    };

};
