/*
 * @author ohmed
 * DatTank Ruin decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Ruin1Decoration extends DecorationObject {

    static title: string = 'Ruin1';

    //

    constructor ( params ) {

        super( params );
        this.title = Ruin1Decoration.title;

    };

};

//

export { Ruin1Decoration };
