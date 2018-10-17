/*
 * @author ohmed
 * DatTank Tree decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";

import { DecorationObject } from "./../../../objects/core/Decoration.Object";
import { CollisionManager } from "./../../../managers/Collision.Manager";

//

class Tree5Decoration extends DecorationObject {

    static title: string = 'Tree5';
    public size: OMath.Vec3 = new OMath.Vec3( 30, 70, 30 );

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree5Decoration.title;
        this.uvOffset.set( 2, 2 );

        CollisionManager.addObject( this, 'box', false );

    };

};

//

export { Tree5Decoration };
