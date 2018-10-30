/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from '../../../objects/core/Decoration.Object';
import { CollisionManager } from '../../../managers/Collision.Manager';

//

export class Tree3Decoration extends DecorationObject {

    public static title: string = 'Tree3';
    public radius: number = 20;

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree3Decoration.title;
        this.uvOffset.set( 0, 2 );

        CollisionManager.addObject( this, 'circle', false );

    };

};
