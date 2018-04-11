/*
 * @author ohmed
 * DatTank AmmoBox
*/

import { BoxCore } from "./../../core/objects/Box.Core";

//

class AmmoBox extends BoxCore {

    constructor ( params ) {

        super( params );
        this.type = 'AmmoBox';

    };

};

//

export { AmmoBox };
