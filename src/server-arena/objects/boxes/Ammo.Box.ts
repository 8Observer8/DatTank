/*
 * @author ohmed
 * AmmoBox Object class
*/

import { BoxObject } from "./../core/Box.Object";
import { ArenaCore } from "./../../core/Arena.Core";
import { PlayerCore } from "./../../core/Player.Core";

//

class AmmoBoxObject extends BoxObject {

    public pickUp ( player: PlayerCore ) {

        this.dispose();
        player.changeAmmo( this.amount );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );
        this.type = 'AmmoBox';
        this.amount = 40;

    };

};

//

export { AmmoBoxObject };
