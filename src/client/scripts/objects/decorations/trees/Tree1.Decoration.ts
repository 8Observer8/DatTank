/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Tree1Decoration extends DecorationObject {

    static title: string = 'Tree1';

    //

    constructor ( params ) {

        super( params );
        this.title = Tree1Decoration.title;

    };

};

//

export { Tree1Decoration };
