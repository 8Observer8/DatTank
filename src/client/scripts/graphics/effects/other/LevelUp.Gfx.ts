/*
 * @author ohmed
 * DatTank Tank levelUp graphics class
*/

import * as THREE from 'three';

import { GfxCore } from '../../Core.Gfx';

//

export class LevelUpGfx {

    public active: boolean = false;

    private object: THREE.Object3D = new THREE.Object3D();

    //

    public dispose () : void {

        if ( ! GfxCore.coreObjects['level-up'] || ! this.object ) return;
        GfxCore.coreObjects['level-up'].remove( this.object );

    };

    public hide () : void {

        this.object.visible = false;

    };

    public update ( time: number, delta: number ) : void {

        // todo

    };

    public init () : void {

        // todo

        //

        if ( ! GfxCore.coreObjects['level-up'] ) {

            GfxCore.coreObjects['level-up'] = new THREE.Object3D();
            GfxCore.coreObjects['level-up'].name = 'TankTraces';
            GfxCore.scene.add( GfxCore.coreObjects['level-up'] );

        }

        GfxCore.coreObjects['level-up'].add( this.object );

    };

};
