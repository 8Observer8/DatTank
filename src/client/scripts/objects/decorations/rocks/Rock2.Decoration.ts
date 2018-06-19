/*
 * @author ohmed
 * DatTank Rock decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Rock2Decoration extends DecorationObject {

    static title: string = 'Rock2';

    //

    constructor ( params ) {

        super( params );
        this.title = Rock2Decoration.title;
        this.uvOffset.set( 1, 0 );

    };

};

//

export { Rock2Decoration };
