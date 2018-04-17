/*
 * @author ohmed
 * DatTank Rock decoration
*/

import { DecorationCore } from "./../../../core/objects/Decoration.Core";

//

class Rock1Decoration extends DecorationCore {

    static title: string = 'Rock1';

    //

    constructor ( params ) {

        super( params );
        this.title = Rock1Decoration.title;

    };

};

//

export { Rock1Decoration };
