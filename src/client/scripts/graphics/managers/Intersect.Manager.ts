/*
 * @author ohmed
 * DatTank Arena object intersect manager
*/

import * as THREE from 'three';

//

export class IntersectManager {

    private intersectObjectsList: Array<THREE.Object3D | THREE.Mesh> = [];
    private raycaster: THREE.Raycaster = new THREE.Raycaster();

    //

    public addObject ( object: THREE.Object3D | THREE.Mesh ) : void {

        if ( ! object ) return;
        this.intersectObjectsList.push( object );

    };

    public removeObject ( object: THREE.Mesh | THREE.Object3D ) : void {

        if ( ! object ) return;
        const newList = [];

        for ( let i = 0, il = this.intersectObjectsList.length; i < il; i ++ ) {

            if ( this.intersectObjectsList[ i ].uuid !== object.uuid ) {

                newList.push( this.intersectObjectsList[ i ] );

            }

        }

        this.intersectObjectsList = newList;

    };

    public getIntersection ( position: THREE.Vector3, angle: number, far: number ) : THREE.Intersection[] {

        this.raycaster.near = 5;
        this.raycaster.far = far;
        this.raycaster.ray.direction.set( Math.cos( angle ), 0, Math.sin( angle ) );
        this.raycaster.ray.origin.copy( position );
        return this.raycaster.intersectObjects( this.intersectObjectsList, true );

    };

};
