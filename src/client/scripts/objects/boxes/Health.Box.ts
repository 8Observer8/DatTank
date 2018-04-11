/*
 * @author ohmed
 * DatTank HealthBox
*/

import { BoxCore } from "./../../core/objects/Box.Core";

//

class HealthBox extends BoxCore {

    constructor ( params ) {

        super( params );
        this.type = 'HealthBox';

    };

};

//

export { HealthBox };
