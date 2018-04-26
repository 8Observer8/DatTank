/*
 * @author ohmed
 * DatTank Tank ground traces graphics class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";

//

class TankTracesGfx {

    private objects = [];
    private target: THREE.Object3D;
    private prevPosition: OMath.Vec3 = new OMath.Vec3();
    private indexOffset: number = 0;
    private tracePosOffset = { l: 13, r: 13 };
    private object: THREE.Object3D = new THREE.Object3D();

    //

    public dispose () {

        //

    };

    private addTraceIfNeeded () {

        let rotation = this.target.rotation.y;
        let position = this.target.position;
        let dist = 12;

        if ( this.prevPosition.distanceTo( position ) > 4 ) {
    
            var plane1, plane2;
    
            var track = this.objects[ this.indexOffset ];
            plane1 = track.left;
            plane2 = track.right;
    
            track.lastUpdate = Date.now();
    
            plane1.rotation.x = - Math.PI / 2;
            plane1.rotation.z = rotation;
            plane1.position.copy( position );
            plane1.position.x += this.tracePosOffset.l * Math.cos( - rotation );
            plane1.position.z += this.tracePosOffset.l * Math.sin( - rotation );
            plane1.position.y = 2.2;
    
            plane2.rotation.x = - Math.PI / 2;
            plane2.position.copy( position );
            plane2.rotation.z = rotation;
            plane2.position.x -= this.tracePosOffset.r * Math.cos( - rotation );
            plane2.position.z -= this.tracePosOffset.r * Math.sin( - rotation );
            plane2.position.y = 2.2;
    
            track.position.copy( position );
    
            this.prevPosition.x = position.x;
            this.prevPosition.z = position.z;
    
            this.indexOffset ++;
            if ( this.indexOffset === 35 ) this.indexOffset = 0;
    
        }

    };

    public update ( time: number, delta: number ) {

        this.addTraceIfNeeded();

        for ( let i = 0, il = this.objects.length; i < il; i ++ ) {

            this.objects[ i ].material.opacity = 1 - Math.min( Date.now() - this.objects[ i ].lastUpdate, 2300 ) / 2300;
    
        }

    };

    public init ( target: THREE.Object3D ) {

        this.target = target;
        this.prevPosition.set( this.target.position.x, this.target.position.y, this.target.position.z );

        //

        let material;
        let plane1, plane2;
    
        for ( let i = 0; i < 35; i ++ ) {

            material = new THREE.MeshBasicMaterial({ color: 0x140a00, transparent: true, opacity: 0.7, depthWrite: false });
            plane1 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 6, 2 ), material );
            plane2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 6, 2 ), material );

            this.objects.push({
                left:       plane1,
                right:      plane2,
                material:   material,
                position:   new THREE.Vector3(),
                lastUpdate: 0
            });
    
            plane1.renderOrder = 10;
            plane2.renderOrder = 10;

            this.object.add( plane1 );
            this.object.add( plane2 );

        }

        //

        if ( ! GfxCore.coreObjects['tank-tracks'] ) {

            GfxCore.coreObjects['tank-tracks'] = new THREE.Object3D();
            GfxCore.coreObjects['tank-tracks'].name = 'TankTracks';
            GfxCore.scene.add( GfxCore.coreObjects['tank-tracks'] );

        }

        // GfxCore.coreObjects['tank-tracks'].add( this.object );

    };

};

//

export { TankTracesGfx };
