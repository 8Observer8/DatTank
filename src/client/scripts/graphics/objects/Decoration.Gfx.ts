/*
 * @author ohmed
 * DatTank Decoration graphics class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { GfxCore } from "./../Core.Gfx";
import { DecorationCore } from "./../../core/objects/Decoration.Core";
import { ResourceManager } from "./../../managers/Resource.Manager";

//

class DecorationGfx {

    private object: THREE.Object3D = new THREE.Object3D();

    //

    public dispose () {

        GfxCore.coreObjects['decorations'].remove( this.object );

    };

    public update ( time: number, delta: number ) {

        var dx = this.object.position.x - GfxCore.camera.position.x;
        var dz = this.object.position.z - GfxCore.camera.position.z;

        if ( Math.sqrt( dx * dx + dz * dz ) < 100 ) {

            for ( let i = 0, il = this.object.children[0]['material'].length; i < il; i ++ ) {

                let object = this.object.children[0];
                let material = object['material'][i];

                material.side = THREE.BackSide;
                material.transparent = true;
                material.opacity = 0.2;
                material.depthWrite = false;
                material.depthTest = false;
                object.renderOrder = 10;

            }

        } else {

            for ( let i = 0, il = this.object.children[0]['material'].length; i < il; i ++ ) {

                let object = this.object.children[0];
                let material = object['material'][i];

                material.side = THREE.FrontSide;
                material.transparent = false;
                material.opacity = 1;
                material.depthWrite = true;
                material.depthTest = true;
                object.renderOrder = 0;

            }

        }

    };

    public init ( decoration: DecorationCore ) {

        let decorationModel = ResourceManager.getModel( 'decorations/' + decoration.title );

        let material = [];
        for ( let i = 0, il = decorationModel.material.length; i < il; i ++ ) {

            material.push( decorationModel.material[ i ].clone() );

        }

        //

        if ( decoration.title.indexOf('Tree') !== -1 ) {

            material[0].map = ResourceManager.getTexture('Flora-texture.png');

        } else if ( decoration.title.indexOf('Rock') !== -1 ) {

            material[0].map = ResourceManager.getTexture('Rocks-texture.png');

        }

        material[0].map.needsUpdate = true;

        //

        let mesh = new THREE.Mesh( decorationModel.geometry, material );

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
