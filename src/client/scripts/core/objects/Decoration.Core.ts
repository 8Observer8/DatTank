/*
 * @author ohmed
 * DatTank Decoration general class
*/

import * as OMath from "./../../OMath/Core.OMath";
import { DecorationGfx } from "./../../graphics/objects/Decoration.Gfx";
import { ResourceManager } from "./../../managers/Resource.Manager";

//

class DecorationCore {

    public id: number;
    public title: string;
    public position: OMath.Vec3 = new OMath.Vec3();
    public scale: OMath.Vec3 = new OMath.Vec3();

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
import { Tree2Decoration } from "./../../objects/decorations/trees/Tree2.Decoration";
import { Tree3Decoration } from "./../../objects/decorations/trees/Tree3.Decoration";
import { Tree4Decoration } from "./../../objects/decorations/trees/Tree4.Decoration";
import { Tree5Decoration } from "./../../objects/decorations/trees/Tree5.Decoration";
import { Tree6Decoration } from "./../../objects/decorations/trees/Tree6.Decoration";
import { Tree7Decoration } from "./../../objects/decorations/trees/Tree7.Decoration";
import { Tree8Decoration } from "./../../objects/decorations/trees/Tree8.Decoration";

import { Rock1Decoration } from "./../../objects/decorations/rocks/Rock1.Decoration";
import { Rock2Decoration } from "./../../objects/decorations/rocks/Rock2.Decoration";
import { Rock3Decoration } from "./../../objects/decorations/rocks/Rock3.Decoration";
import { Rock4Decoration } from "./../../objects/decorations/rocks/Rock4.Decoration";
import { Rock5Decoration } from "./../../objects/decorations/rocks/Rock5.Decoration";
import { Rock6Decoration } from "./../../objects/decorations/rocks/Rock6.Decoration";
import { Rock7Decoration } from "./../../objects/decorations/rocks/Rock7.Decoration";
import { Rock8Decoration } from "./../../objects/decorations/rocks/Rock8.Decoration";

import { Ruin1Decoration } from "./../../objects/decorations/ruins/Ruin1.Decoration";

let DecorationList = {

    Tree1:  Tree1Decoration,
    Tree2:  Tree2Decoration,
    Tree3:  Tree3Decoration,
    Tree4:  Tree4Decoration,
    Tree5:  Tree5Decoration,
    Tree6:  Tree6Decoration,
    Tree7:  Tree7Decoration,
    Tree8:  Tree8Decoration,

    Rock1:  Rock1Decoration,
    Rock2:  Rock2Decoration,
    Rock3:  Rock3Decoration,
    Rock4:  Rock4Decoration,
    Rock5:  Rock5Decoration,
    Rock6:  Rock6Decoration,
    Rock7:  Rock7Decoration,
    Rock8:  Rock8Decoration,

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
