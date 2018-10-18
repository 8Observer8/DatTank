/*
 * @author ohmed
 * DatTank Tree decoration
*/

import * as OMath from '../../../OMath/Core.OMath';

import { DecorationObject } from '../../../objects/core/Decoration.Object';
import { CollisionManager } from '../../../managers/Collision.Manager';

//

export class Tree4Decoration extends DecorationObject {

    public static title: string = 'Tree4';
    public size: OMath.Vec3 = new OMath.Vec3( 30, 70, 30 );

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree4Decoration.title;
        this.uvOffset.set( 2, 2 );

        CollisionManager.addObject( this, 'box', false );

    };

};
