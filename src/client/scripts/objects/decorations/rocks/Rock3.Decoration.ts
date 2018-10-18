/*
 * @author ohmed
 * DatTank Rock decoration
*/

import { DecorationObject } from '../../../objects/core/Decoration.Object';

//

export class Rock3Decoration extends DecorationObject {

    public static title: string = 'Rock3';

    //

    constructor ( params: any ) {

        super( params );
        this.title = Rock3Decoration.title;
        this.uvOffset.set( 2, 0 );

    };

};
