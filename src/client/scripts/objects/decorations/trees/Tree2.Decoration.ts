/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Tree2Decoration extends DecorationObject {

    static title: string = 'Tree2';

    //

    constructor ( params ) {

        super( params );
        this.title = Tree2Decoration.title;
        this.uvOffset.set( 2, 1 );

    };

};

//

export { Tree2Decoration };
