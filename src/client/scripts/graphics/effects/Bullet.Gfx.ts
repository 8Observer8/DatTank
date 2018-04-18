/*
 * @author ohmed
 * DatTank Default bullet graphics class
*/

import * as THREE from 'three';

import { GfxCore } from "./../Core.Gfx";

//

class BulletGfx {

    public active: boolean = false;

    private object: THREE.Object3D = new THREE.Object3D();
    private trace: THREE.Mesh;
    private bullet: THREE.Mesh;

    //

    public update ( time: number, delta: number ) {

        // todo

    };

    public init () {

        this.bullet = new THREE.Mesh( new THREE.BoxGeometry( 2.5, 2.5, 2.5 ), new THREE.MeshBasicMaterial({ color: 0xff3333 }) );
        this.bullet.visible = false;

        this.object.add( this.bullet );

        //

        if ( ! GfxCore.coreObjects['bullets'] ) {

            GfxCore.coreObjects['bullets'] = new THREE.Object3D();
            GfxCore.coreObjects['bullets'].name = 'Bullets';
            GfxCore.scene.add( GfxCore.coreObjects['bullets'] );

        }

        GfxCore.coreObjects['bullets'].add( this.object );

    };

};

//

export { BulletGfx };
