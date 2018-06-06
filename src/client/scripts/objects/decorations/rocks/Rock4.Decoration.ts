/*
 * @author ohmed
 * DatTank Rock decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Rock4Decoration extends DecorationObject {

    static title: string = 'Rock4';

    //

    constructor ( params ) {

        super( params );
        this.title = Rock4Decoration.title;

    };

};

//

export { Rock4Decoration };
