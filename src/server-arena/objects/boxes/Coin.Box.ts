/*
 * @author ohmed
 * CoinBox Object class
*/

import { ArenaCore } from '../../core/Arena.Core';
import { TankObject } from '../core/Tank.Object';
import { BoxObject } from '../core/Box.Object';

//

export class CoinBoxObject extends BoxObject {

    public pickUp ( tank: TankObject ) : void {

        this.dispose( tank.player );
        tank.player.updateStats( 0, this.amount );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );
        this.typeId = 2;
        this.amount = params.amount || 1;

    };

};
