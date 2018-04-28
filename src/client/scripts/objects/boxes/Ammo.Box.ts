/*
 * @author ohmed
 * DatTank AmmoBox
*/

import { BoxCore } from "./../../core/objects/Box.Core";

//

class AmmoBox extends BoxCore {

    static bid = 0;

    //

    constructor ( params ) {

        super( params );
        this.type = 'AmmoBox';

    };

};

//

export { AmmoBox };
