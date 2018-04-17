/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationCore } from "./../../../core/objects/Decoration.Core";

//

class Tree2Decoration extends DecorationCore {

    static title: string = 'Tree2';

    //

    constructor ( params ) {

        super( params );
        this.title = Tree2Decoration.title;

    };

};

//

export { Tree2Decoration };
