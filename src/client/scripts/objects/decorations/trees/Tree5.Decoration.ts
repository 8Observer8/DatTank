/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from '../../../objects/core/Decoration.Object';
import { CollisionManager } from '../../../managers/Collision.Manager';

//

export class Tree5Decoration extends DecorationObject {

    public static title: string = 'Tree5';
    public radius: number = 30;

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree5Decoration.title;
        this.uvOffset.set( 2, 2 );

        CollisionManager.addObject( this, 'circle', false );

    };

};
