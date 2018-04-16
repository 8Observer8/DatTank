/*
 * @author ohmed
 * DatTank Decoration general class
*/

import * as THREE from 'three';

import * as OMath from "./../../OMath/Core.OMath";
import { DecorationGfx } from "./../../graphics/objects/Decoration.Gfx";
import { ResourceManager } from "./../../managers/Resource.Manager";

//

class DecorationCore {

    private object: THREE.Object3D = new THREE.Object3D();
    public id: number;
    public title: string;
    
    protected gfx: DecorationGfx = new DecorationGfx();

    //

    public init ( decorationTitle: string ) {

        // todo

    };

    public destroy () {

        // todo

    };

};

// get all towers and put into 'TowersList' object

import { Tree1Decoration } from "./../../objects/decorations/trees/Tree1.Decoration";

import { Rock1Decoration } from "./../../objects/decorations/rocks/Rock1.Decoration";

import { Ruin1Decoration } from "./../../objects/decorations/ruins/Ruin1.Decoration";

let DecorationList = {
    Tree1:  Tree1Decoration,
    Rock1:  Rock1Decoration,
    Ruin1:  Ruin1Decoration,
    getById: function ( decorationId ) {

        for ( let item in DecorationList ) {

            if ( typeof item === "string" ) {

                if ( DecorationList[ item ].tid === decorationId ) {

                    return item;

                }

            }

        }

        return null;

    }
};

//

export { DecorationCore };
export { DecorationList };
