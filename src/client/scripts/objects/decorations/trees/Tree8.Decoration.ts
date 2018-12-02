/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from '../../../objects/core/Decoration.Object';
import { CollisionManager } from '../../../managers/arena/Collision.Manager';

//

export class Tree8Decoration extends DecorationObject {

    public static title: string = 'Tree8';
    public radius: number = 10;

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree8Decoration.title;
        this.uvOffset.set( 3, 2 );

        CollisionManager.addObject( this, 'circle', false );

    };

};
