/*
 * @author ohmed
 * DatTank Tree decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";

import { DecorationObject } from "./../../../objects/core/Decoration.Object";
import { CollisionManager } from "./../../../managers/Collision.Manager";

//

class Tree7Decoration extends DecorationObject {

    static title: string = 'Tree7';
    public size: OMath.Vec3 = new OMath.Vec3( 10, 70, 10 );

    //

    constructor ( params ) {

        super( params );
        this.title = Tree7Decoration.title;
        this.uvOffset.set( 3, 1 );

        CollisionManager.addObject( this, 'box', false );

    };

};

//

export { Tree7Decoration };
