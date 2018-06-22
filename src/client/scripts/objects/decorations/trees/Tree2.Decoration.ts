/*
 * @author ohmed
 * DatTank Tree decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";

import { DecorationObject } from "./../../../objects/core/Decoration.Object";
import { CollisionManager } from "./../../../managers/Collision.Manager";

//

class Tree2Decoration extends DecorationObject {

    static title: string = 'Tree2';
    public size: OMath.Vec3 = new OMath.Vec3( 20, 70, 20 );

    //

    constructor ( params ) {

        super( params );
        this.title = Tree2Decoration.title;
        this.uvOffset.set( 2, 1 );

        CollisionManager.addObject( this, 'box', false );

    };

};

//

export { Tree2Decoration };
