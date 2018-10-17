/*
 * @author ohmed
 * DatTank Tower Change team effect graphics class
*/

import * as THREE from 'three';

//

export class TowerChangeTeamGfx {

    private object: THREE.Object3D = new THREE.Object3D();
    private time: number;
    private pipe: THREE.Mesh;

    public active: boolean = false;

    //

    public update ( time: number, delta: number ) : void {

        if ( ! this.active ) return;

        this.time += delta;
        const progress = this.time / 2000;

        if ( progress > 0.5 ) {

            this.pipe.material['opacity'] = 1 - progress;

        } else {

            this.pipe.material['opacity'] = progress / 2;
            this.pipe.position.y += 0.6 * delta / 16;
            this.pipe.scale.set( progress, progress, progress );

        }

        if ( progress >= 1 ) {

            this.active = false;
            this.object.visible = false;

        }

        this.object.updateMatrixWorld( true );

    };

    public show ( color: number ) : void {

        this.time = 0;
        this.pipe.material['color'].setHex( color );
        this.pipe.material['opacity'] = 0;
        this.pipe.position.y = 100;
        this.pipe.scale.set( 0.1, 0.1, 0.1 );
        this.object.visible = true;
        this.active = true;

    };

    public init ( target: THREE.Object3D ) : void {

        this.pipe = new THREE.Mesh( new THREE.CylinderBufferGeometry( 50, 50, 550, 10 ), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, depthWrite: false }) );
        this.pipe.renderOrder = 10;
        this.object.visible = false;
        this.object.add( this.pipe );

        target.add( this.object );

    };

};
