/*
 * @author ohmed
 * DatTank CoinBox
*/

import { BoxObject } from '../../objects/core/Box.Object';

//

export class CoinBox extends BoxObject {

    public static bid = 2;
    public pickSound: string = 'coin_pick.wav';

    //

    constructor ( params: any ) {

        super( params );
        this.type = 'CoinBox';

    };

};
