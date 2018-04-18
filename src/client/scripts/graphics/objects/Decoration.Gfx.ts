/*
 * @author ohmed
 * DatTank Decoration graphics class
*/

import * as THREE from 'three';

import { GfxCore } from "./../Core.Gfx";
import { DecorationCore } from "./../../core/objects/Decoration.Core";
import { ResourceManager } from "./../../managers/Resource.Manager";

//

class DecorationGfx {

    private object: THREE.Object3D = new THREE.Object3D();

    //

    public dispose () {

        // view.scene.remove( this.mesh );

    };

    public update ( time: number, delta: number ) {

        // todo

    };

    public init ( decoration: DecorationCore ) {

        let decorationModel = ResourceManager.getModel( 'decorations/' + decoration.title );

        let mesh = new THREE.Mesh( decorationModel.geometry, decorationModel.material );

        this.object.name = decoration.title;

        this.object.position.x = decoration.position.x;
        this.object.position.y = decoration.position.y;
        this.object.position.z = decoration.position.z;

        this.object.rotation.y = decoration.rotation;

        this.object.scale.x = decoration.scale.x;
        this.object.scale.y = decoration.scale.y;
        this.object.scale.z = decoration.scale.z;

        this.object.add( mesh );

        //

        if ( ! GfxCore.coreObjects['decorations'] ) {

            GfxCore.coreObjects['decorations'] = new THREE.Object3D();
            GfxCore.coreObjects['decorations'].name = 'Decorations';
            GfxCore.scene.add( GfxCore.coreObjects['decorations'] );

        }

        GfxCore.coreObjects['decorations'].add( this.object );

    };

};

//

export { DecorationGfx };
