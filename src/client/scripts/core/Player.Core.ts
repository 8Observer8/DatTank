/*
 * @author ohmed
 * DatTank Player core
*/

import { EventDispatcher } from "./../utils/EventDispatcher";

import { TankCore } from "./objects/Tank.Core";
import { ArenaCore } from "./Arena.Core";
import { TeamCore } from "./Team.Core";

import { PlayerNetwork } from "./../network/Player.Network";

//

declare enum Status { Alive = 0, Dead = 1 };

//

class PlayerCore extends EventDispatcher {

    public arena: ArenaCore;
    public id: number;
    public username: string;
    public status: Status;

    public team: TeamCore;
    public tank: TankCore;

    public health: number;
    public ammo: number;
    public kills: number;
    public score: number;

    private network: PlayerNetwork = new PlayerNetwork();

    //

    private setTank ( tankName: string ) {

        // todo

    };

    public triggerRespawn () {

        // todo

    };

    public respawn ( params ) {

        // todo

    };

    private updateMovement ( time: number, delta: number ) {

        // todo

    };

    public setMovement ( directionX: number, directionZ: number, positionX: number, positionZ: number, rotation: number ) {

        // todo

    };

    public setTopRotation ( angle: number ) {

        // todo

    };

    public setHealth ( value: number, trigger: any ) {

        // todo

    };

    public setAmmo ( value: number ) {

        // todo

    };

    public shoot ( id: number ) {

        // todo

    };

    public die () {

        // todo

    };

    public dispose () {

        // todo

    };

    public update ( time: number, delta: number ) {

        // todo

    };

    //

    constructor ( arena, params ) {

        super();
        this.arena = arena;

    };

};

//

export { PlayerCore };
