/*
 * @author ohmed
 * DatTank Rock decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Rock1Decoration extends DecorationObject {

    static title: string = 'Rock1';

    //

    constructor ( params ) {

        super( params );
        this.title = Rock1Decoration.title;
        this.uvOffset.set( 0, 0 );

    };

};

//

export { Rock1Decoration };
