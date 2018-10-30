/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from '../../../objects/core/Decoration.Object';
import { CollisionManager } from '../../../managers/Collision.Manager';

//

export class Tree1Decoration extends DecorationObject {

    public static title: string = 'Tree1';
    public radius: number = 10;

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree1Decoration.title;
        this.uvOffset.set( 1, 1 );

        CollisionManager.addObject( this, 'circle', false );

    };

};
