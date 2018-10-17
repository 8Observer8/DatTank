/*
 * @author ohmed
 * DatTank HealthBox
*/

import { BoxObject } from "./../../objects/core/Box.Object";

//

class HealthBox extends BoxObject {

    static bid = 1;

    //

    constructor ( params: any ) {

        super( params );
        this.type = 'HealthBox';

    };

};

//

export { HealthBox };
