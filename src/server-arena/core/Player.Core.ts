/*
 * @author ohmed
 * DatTank Player Core
*/

import { ArenaCore } from "./Arena.Core";
import { TeamCore } from "./../core/Team.Core";
import { TankObject } from "./../objects/core/Tank.Object";

//

class PlayerCore {

    private arena: ArenaCore;

    public id: number;
    public team: TeamCore;
    public socket: any;

    public tank: TankObject;

    //

    public respawn () {

        // todo

    };

    public changeAmmo ( value: number ) {

        // todo

    };

    public changeHealth ( value: number ) {

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
