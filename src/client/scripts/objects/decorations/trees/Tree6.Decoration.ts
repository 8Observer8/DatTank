/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from '../../../objects/core/Decoration.Object';
import { CollisionManager } from '../../../managers/arena/Collision.Manager';

//

export class Tree6Decoration extends DecorationObject {

    public static title: string = 'Tree6';
    public radius: number = 20;

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree6Decoration.title;
        this.uvOffset.set( 3, 0 );

        CollisionManager.addObject( this, 'circle', false );

    };

};
