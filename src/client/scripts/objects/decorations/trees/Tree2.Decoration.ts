/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from '../../../objects/core/Decoration.Object';
import { CollisionManager } from '../../../managers/arena/Collision.Manager';

//

export class Tree2Decoration extends DecorationObject {

    public static title: string = 'Tree2';
    public radius: number = 10;

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree2Decoration.title;
        this.uvOffset.set( 2, 1 );

        CollisionManager.addObject( this, 'circle', false );

    };

};
