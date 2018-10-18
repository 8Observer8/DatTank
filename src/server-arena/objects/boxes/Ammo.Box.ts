/*
 * @author ohmed
 * AmmoBox Object class
*/

import { ArenaCore } from '../../core/Arena.Core';
import { TankObject } from '../core/Tank.Object';
import { BoxObject } from '../core/Box.Object';

//

export class AmmoBoxObject extends BoxObject {

    public pickUp ( tank: TankObject ) : void {

        this.dispose( tank.player );
        tank.changeAmmo( this.amount );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );
        this.typeId = 0;
        this.amount = 40;

    };

};
