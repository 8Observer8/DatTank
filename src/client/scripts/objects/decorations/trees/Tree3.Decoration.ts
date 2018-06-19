/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Tree3Decoration extends DecorationObject {

    static title: string = 'Tree3';

    //

    constructor ( params ) {

        super( params );
        this.title = Tree3Decoration.title;
        this.uvOffset.set( 0, 2 );

    };

};

//

export { Tree3Decoration };
