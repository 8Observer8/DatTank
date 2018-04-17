/*
 * @author ohmed
 * DatTank Rock decoration
*/

import { DecorationCore } from "./../../../core/objects/Decoration.Core";

//

class Rock4Decoration extends DecorationCore {

    static title: string = 'Rock4';

    //

    constructor ( params ) {

        super( params );
        this.title = Rock4Decoration.title;

    };

};

//

export { Rock4Decoration };
