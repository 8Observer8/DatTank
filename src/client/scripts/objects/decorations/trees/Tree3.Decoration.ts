/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationCore } from "./../../../core/objects/Decoration.Core";

//

class Tree3Decoration extends DecorationCore {

    static title: string = 'Tree3';

    //

    constructor ( params ) {

        super( params );
        this.title = Tree3Decoration.title;

    };

};

//

export { Tree3Decoration };
