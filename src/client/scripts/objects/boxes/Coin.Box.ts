/*
 * @author ohmed
 * DatTank CoinBox
*/

import { BoxObject } from '../../objects/core/Box.Object';

//

export class CoinBox extends BoxObject {

    public static bid = 2;

    //

    constructor ( params: any ) {

        super( params );
        this.type = 'CoinBox';

    };

};
