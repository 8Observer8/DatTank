/*
 * @author ohmed
 * DatTank Arena decoration manager
*/

import * as THREE from 'three';

import { GfxCore } from "./../graphics/Core.Gfx";

//

class DecorationManagerCore {

    private static instance: DecorationManagerCore;

    private decorations: Array<any> = [];

    //

    public update ( time: number, delta: number ) {

        for ( var i = 0, il = this.decorations.length; i < il; i ++ ) {

            var decoration = this.decorations[ i ];
            var dx = decoration.position.x - GfxCore.camera.position.x;
            var dz = decoration.position.z - GfxCore.camera.position.z;

            if ( Math.sqrt( dx * dx + dz * dz ) < 100 ) {

                decoration.material[0].side = THREE.BackSide;
                decoration.material[0].transparent = true;
                decoration.material[0].opacity = 0.2;
                decoration.material[0].depthWrite = false;
                decoration.material[0].depthTest = false;
                decoration.renderOrder = 10;

            } else {

                decoration.material[0].side = THREE.FrontSide;
                decoration.material[0].transparent = false;
                decoration.material[0].opacity = 1;
                decoration.material[0].depthWrite = true;
                decoration.material[0].depthTest = true;
                decoration.renderOrder = 0;

            }

        }

    };

    //

    constructor () {

        if ( DecorationManagerCore.instance ) {

            return DecorationManagerCore.instance;

        }

        DecorationManagerCore.instance = this;

    };

};

//

export let DecorationManager = new DecorationManagerCore();
