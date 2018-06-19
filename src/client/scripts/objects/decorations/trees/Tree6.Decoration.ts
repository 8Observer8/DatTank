/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Tree6Decoration extends DecorationObject {

    static title: string = 'Tree6';

    //

    constructor ( params ) {

        super( params );
        this.title = Tree6Decoration.title;
        this.uvOffset.set( 3, 0 );

    };

};

//

export { Tree6Decoration };
