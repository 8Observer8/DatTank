/*
 * @author ohmed
 * HealthBox Object class
*/

import { BoxObject } from "./../core/Box.Object";
import { ArenaCore } from "./../../core/Arena.Core";
import { PlayerCore } from "./../../core/Player.Core";

//

class HealthBoxObject extends BoxObject {

    public pickUp ( player: PlayerCore ) {

        this.dispose();
        player.tank.changeHealth( this.amount );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );
        this.type = 'HealthBox';
        this.typeId = 1;
        this.amount = 20;

    };

};

//

export { HealthBoxObject };
