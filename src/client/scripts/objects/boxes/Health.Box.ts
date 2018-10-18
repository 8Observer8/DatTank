/*
 * @author ohmed
 * DatTank HealthBox
*/

import { BoxObject } from '../../objects/core/Box.Object';

//

export class HealthBox extends BoxObject {

    public static bid = 1;

    //

    constructor ( params: any ) {

        super( params );
        this.type = 'HealthBox';

    };

};
