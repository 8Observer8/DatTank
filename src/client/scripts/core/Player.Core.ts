/*
 * @author ohmed
 * DatTank Player core
*/

import { TankCore } from "./objects/Tank.Core";
import { Arena } from "./Arena.Core";
import { TeamCore } from "./Team.Core";
import { TankList as Tanks } from "./objects/Tank.Core";
import { TeamManager } from "./../managers/Team.Manager";
import { PlayerNetwork } from "./../network/Player.Network";
import { UI } from "./../ui/Core.UI";

//

enum Status { ALIVE = 0, DEAD = 1 };

//

class PlayerCore {

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

    private setTank ( tankId: string, params ) {
    
        let tankName = Tanks.getById( tankId );

        if ( tankName ) {
        
            this.tank = new Tanks[ tankName ]( params );
            this.tank.player = this;

        }

    };

    public triggerRespawn () {

        var tank = localStorage.getItem( 'currentTank' ) || 'IS2';
        this.network.respawn( tank );

    };

    public respawn ( params ) {

        this.tank.dispose();
        this.status = Status.ALIVE;
        this.setTank( params.tank, params );
        this.tank.init();

        if ( Arena.me.id === this.id ) {

            UI.InGame.updateHealth( this.tank.health );
            UI.InGame.updateAmmo( this.tank.ammo );
            UI.InGame.hideContinueBox();
    
        }    

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

        this.id = params.id;
        this.setTank( params.tank, params );
        this.tank.init();
        this.team = TeamManager.getById( params.team );

    };

    //

    constructor ( params ) {

        this.init( params );

    };

};

//

export { PlayerCore };
