/*
 * @author ohmed
 * DatTank Tree decoration
*/

import { DecorationCore } from "./../../../core/objects/Decoration.Core";

//

class Tree1Decoration extends DecorationCore {

    static title: string = 'Tree1';

    //

    constructor ( params ) {

        super( params );
        this.title = Tree1Decoration.title;

    };

};

//

export { Tree1Decoration };