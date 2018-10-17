/*
 * @author ohmed
 * DatTank AmmoBox
*/

import { BoxObject } from "./../../objects/core/Box.Object";

//

class AmmoBox extends BoxObject {

    static bid = 0;

    //

    constructor ( params: any ) {

        super( params );
        this.type = 'AmmoBox';

    };

};

//

export { AmmoBox };
