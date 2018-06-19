/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Tree7Decoration extends DecorationObject {

    static title: string = 'Tree7';

    //

    constructor ( params ) {

        super( params );
        this.title = Tree7Decoration.title;
        this.uvOffset.set( 3, 1 );

    };

};

//

export { Tree7Decoration };
