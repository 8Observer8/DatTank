/*
 * @author ohmed
 * DatTank Player core
*/

import { EventDispatcher } from "./../utils/EventDispatcher";

import { TankCore } from "./objects/Tank.Core";
import { Arena } from "./Arena.Core";
import { TeamCore } from "./Team.Core";
import { TankList as Tanks } from "./objects/Tank.Core";
import { PlayerNetwork } from "./../network/Player.Network";

//

enum Status { ALIVE = 0, DEAD = 1 };

//

class PlayerCore extends EventDispatcher {

    public id: number;
    public username: string;
    public status: Status;

    public team: TeamCore;
    public tank: TankCore;

    public kills: number;
    public score: number;
    public bonusLevel: number;

    private network: PlayerNetwork = new PlayerNetwork();

    //

    private setTank ( tankName: string ) {
    
        this.tank = new Tanks[ tankName ]({ player: this });

    };

    public triggerRespawn () {

        var tank = localStorage.getItem( 'currentTank' ) || 'IS2';
        this.network.respawn( tank );

    };

    public respawn ( params ) {

        this.status = Status.ALIVE;
        this.setTank( params.tank );

    };

    public die () {

        // todo

    };

    public dispose () {

        this.tank.dispose();
        this.tank = null;

    };

    public update ( time: number, delta: number ) {

        this.tank.update( time, delta );

    };

    private init ( params ) {

        this.setTank( params.tank );
        // todo rest

    };

    //

    constructor ( arena, params ) {

        super();
        this.init( params );

    };

};

//

export { PlayerCore };
