/*
 * @author ohmed
 * DatTank Tree decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";

import { DecorationObject } from "./../../../objects/core/Decoration.Object";
import { CollisionManager } from "./../../../managers/Collision.Manager";

//

class Tree1Decoration extends DecorationObject {

    static title: string = 'Tree1';
    public size: OMath.Vec3 = new OMath.Vec3( 10, 70, 10 );

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree1Decoration.title;
        this.uvOffset.set( 1, 1 );

        CollisionManager.addObject( this, 'box', false );

    };

};

//

export { Tree1Decoration };
