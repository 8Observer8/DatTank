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

        let decorationModel = ResourceManager.getModel( decoration.title + '.json' );

        let mesh = new THREE.Mesh( decorationModel.geometry, decorationModel.material );
        mesh.name = decoration.title;
        mesh.scale.set( 20, 20, 20 );

        mesh.position.x = decoration.position.x;
        mesh.position.y = decoration.position.y;
        mesh.position.z = decoration.position.z;

        this.object.add( mesh );
        GfxCore.scene.add( this.object );

    };

};

//

export { DecorationGfx };
