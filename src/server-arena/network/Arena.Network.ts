/*
 * @author ohmed
 * DatTank Arena Network handler
*/

import { ArenaCore } from "./../core/Arena.Core";

//

class ArenaNetwork {

    private arena: ArenaCore;

    //

    public sendEventToPlayersInRange ( eventName: string, data: ArrayBuffer, dataView?: Int16Array ) {

        // todo

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};

//

export { ArenaNetwork };
