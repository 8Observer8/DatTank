/*
 * @author ohmed
 * DatTank Rock decoration
*/

import { DecorationCore } from "./../../../core/objects/Decoration.Core";

//

class Rock3Decoration extends DecorationCore {

    static title: string = 'Rock3';

    //

    constructor ( params ) {

        super( params );
        this.title = Rock3Decoration.title;

    };

};

//

export { Rock3Decoration };
