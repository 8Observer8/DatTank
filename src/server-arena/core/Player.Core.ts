/*
 * @author ohmed
 * DatTank Player Core
*/

import { TeamCore } from "./../core/Team.Core";
import { ArenaCore } from "./Arena.Core";

//

class PlayerCore {

    public id: number;
    public team: TeamCore;
    public socket: any;

    private arena: ArenaCore;

    //

    public respawn () {

        // todo

    };

    public update ( delta: number, time: number ) {

        // todo

    };

    public dispose () {

        // todo

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        this.arena = arena;

    };

};

//

export { PlayerCore };
