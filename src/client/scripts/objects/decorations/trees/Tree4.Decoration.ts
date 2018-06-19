/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Tree4Decoration extends DecorationObject {

    static title: string = 'Tree4';

    //

    constructor ( params ) {

        super( params );
        this.title = Tree4Decoration.title;
        this.uvOffset.set( 2, 2 );

    };

};

//

export { Tree4Decoration };
