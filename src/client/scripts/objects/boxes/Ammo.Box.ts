/*
 * @author ohmed
 * DatTank AmmoBox
*/

import { BoxObject } from '../../objects/core/Box.Object';

//

export class AmmoBox extends BoxObject {

    public static bid = 0;

    //

    constructor ( params: any ) {

        super( params );
        this.type = 'AmmoBox';

    };

};
