/*
 * @author ohmed
 * HealthBox Object class
*/

import { ArenaCore } from "./../../core/Arena.Core";
import { TankObject } from "./../core/Tank.Object";
import { BoxObject } from "./../core/Box.Object";

//

class HealthBoxObject extends BoxObject {

    public pickUp ( tank: TankObject ) {

        this.dispose( tank.player );
        tank.changeHealth( this.amount );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );
        this.typeId = 1;
        this.amount = 20;

    };

};

//

export { HealthBoxObject };
