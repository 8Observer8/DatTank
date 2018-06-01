/*
 * @author ohmed
 * DatTank Bot Core
*/

import { ArenaCore } from "./Arena.Core";
import { PlayerCore } from "./Player.Core";

//

class BotCore {

    public id: number;
    public player: PlayerCore;
    public removed: boolean = false;

    private arena: ArenaCore;

    //

    public update ( delta: number, time: number ) {

        // todo

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};

//

export { BotCore };
