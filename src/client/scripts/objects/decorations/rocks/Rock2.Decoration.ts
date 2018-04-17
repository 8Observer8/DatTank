/*
 * @author ohmed
 * DatTank Rock decoration
*/

import { DecorationCore } from "./../../../core/objects/Decoration.Core";

//

class Rock2Decoration extends DecorationCore {

    static title: string = 'Rock2';

    //

    constructor ( params ) {

        super( params );
        this.title = Rock2Decoration.title;

    };

};

//

export { Rock2Decoration };
