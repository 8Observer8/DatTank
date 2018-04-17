/*
 * @author ohmed
 * DatTank Ruin decoration
*/

import { DecorationCore } from "./../../../core/objects/Decoration.Core";

//

class Ruin1Decoration extends DecorationCore {

    static title: string = 'Ruin1';

    //

    constructor ( params ) {

        super( params );
        this.title = Ruin1Decoration.title;

    };

};

//

export { Ruin1Decoration };
