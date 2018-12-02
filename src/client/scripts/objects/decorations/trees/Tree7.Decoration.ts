/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from '../../../objects/core/Decoration.Object';
import { CollisionManager } from '../../../managers/arena/Collision.Manager';

//

export class Tree7Decoration extends DecorationObject {

    public static title: string = 'Tree7';
    public radius: number = 10;

    //

    constructor ( params: any ) {

        super( params );
        this.title = Tree7Decoration.title;
        this.uvOffset.set( 3, 1 );

        CollisionManager.addObject( this, 'circle', false );

    };

};
