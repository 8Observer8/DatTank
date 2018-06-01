/*
 * @author ohmed
 * DatTank Player Core
*/

import { TeamCore } from "./Team.Core";
import { ArenaCore } from "./Arena.Core";

//

class PlayerCore {

    private static numIds: number = 1;

    public id: number;
    public team: TeamCore;
    public arena: ArenaCore;

    public username: string;

    //

    public respawn () {

        // todo

    };

    public toJSON () {

        return {

            id:             this.id,
            login:          this.username,
            team:           this.team.id,
            tank:           this.tank.typeId,
            health:         this.health,
            ammo:           this.ammo,
            rotation:       this.rotation,
            rotationTop:    this.rotationTop,
            position:       this.position,
            moveDirection:  { x: this.moveDirection.x, y: this.moveDirection.y }
    
        };

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        this.arena = arena;

        if ( PlayerCore.numIds > 1000 ) PlayerCore.numIds = 0;
        this.id = PlayerCore.numIds ++;

    };

};

//

export { PlayerCore };
