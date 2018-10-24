/*
 * @author ohmed
 * DatTank Player core
*/

import { Logger } from '../utils/Logger';
import { TankObject } from '../objects/core/Tank.Object';
import { Arena } from './Arena.Core';
import { TeamCore } from './Team.Core';
import { TeamManager } from '../managers/Team.Manager';
import { PlayerNetwork } from '../network/Player.Network';
import { UI } from '../ui/Core.UI';

//

export class PlayerCore {

    public id: number;
    public username: string;

    public team: TeamCore;
    public tank: TankObject | null;

    public kills: number;
    public score: number;
    public bonusLevels: number;

    public level: number = 0;

    private network: PlayerNetwork = new PlayerNetwork();

    //

    public newLevel ( bonusLevels: number ) : void {

        setTimeout( () => {

            UI.InGame.showTankStatsUpdate( bonusLevels );

        }, 3000 );

        this.bonusLevels = bonusLevels;

    };

    public updateStats ( name: string ) : void {

        // todo

    };

    private prepareTank ( params: any ) : void {

        this.tank = new TankObject( params );
        this.tank.player = this;

    };

    public triggerRespawn () : void {

        if ( ! this.tank ) return;

        this.network.respawn({
            base:       this.tank.base.nid,
            cannon:     this.tank.cannon.nid,
            armor:      this.tank.armor.nid,
            engine:     this.tank.engine.nid,
        });

        //

        Logger.newEvent( 'Respawn', 'game' );

    };

    public respawn ( params: any ) : void {

        if ( Arena.me.id === this.id && this.tank ) {

            this.prepareTank( params.tank );
            this.tank.init();
            this.level = 0;

            UI.InGame.updateHealth( this.tank.health );
            UI.InGame.updateAmmo( this.tank.ammo );
            UI.InGame.hideContinueBox();
            UI.InGame.refreshAds();

        } else {

            Arena.removePlayer( this );

        }

    };

    public dispose () : void {

        if ( this.tank ) {

            this.tank.dispose();
            this.tank = null;

        }

        this.network.dispose();

    };

    public update ( time: number, delta: number ) : void {

        if ( this.tank ) {

            this.tank.update( time, delta );

        }

    };

    public init () : void {

        if ( ! this.tank ) {

            return;

        }

        this.tank.init();
        this.network.init( this );

        //

        if ( Arena.me && Arena.me.id === this.id ) {

            UI.InGame.updateHealth( this.tank.health );
            UI.InGame.updateAmmo( this.tank.ammo );

        }

    };

    //

    constructor ( params: any ) {

        const team = TeamManager.getById( params.team );
        this.id = params.id;
        this.username = params.login;

        if ( team ) {

            this.team = team;
            this.prepareTank( params.tank );

        }

    };

};
