/*
 * @author ohmed
 * DatTank Player core
*/

import * as OMath from "./../OMath/Core.OMath";
import { TankCore } from "./objects/Tank.Core";
import { TankList as Tanks } from "./objects/Tank.Core";
import { Arena } from "./Arena.Core";
import { TeamCore } from "./Team.Core";
import { TeamManager } from "./../managers/Team.Manager";
import { PlayerNetwork } from "./../network/Player.Network";
import { UI } from "./../ui/Core.UI";
import { TowerManager } from "../managers/Tower.Manager";
import { PlayerManager } from "../managers/Player.Manager";
import { TowerCore } from "./objects/Tower.Core";

//

class PlayerCore {

    public id: number;
    public username: string;

    public team: TeamCore;
    public tank: TankCore;

    public kills: number;
    public score: number;
    public bonusLevels: number;

    private network: PlayerNetwork = new PlayerNetwork();

    //

    public newLevel ( bonusLevels: number ) {

        setTimeout( () => {

            UI.InGame.showTankStatsUpdate( bonusLevels );

        }, 3000 );

        this.bonusLevels = bonusLevels;

    };

    public updateStats ( name: string ) {

        let stats = {
            'speed':          0,
            'rpm':            1,
            'armour':         2,
            'gun':            3,
            'ammo-capacity':  4
        };

        switch ( name ) {

            case 'speed':

                this.tank.speed += 3;
                break;

            case 'rpm':

                this.tank.rpm *= 1.1;
                break;

            case 'armour':

                this.tank.armour += 10;
                break;

            case 'gun':

                this.tank.bullet += 5;
                break;

            case 'ammo-capacity':

                this.tank.ammoCapacity += 15;
                break;

            default:

                return false;

        }

    };

    private setTank ( tankId: string, params ) {

        let tankName = Tanks.getById( tankId );

        if ( tankName ) {

            this.tank = new Tanks[ tankName ]( params );
            this.tank.player = this;

        }

    };

    public triggerRespawn () {

        let tank = localStorage.getItem( 'currentTank' ) || 'IS2';
        this.network.respawn( tank );

    };

    public respawn ( params ) {

        this.dispose();
        this.setTank( params.tank, params );
        this.tank.init();

        if ( Arena.me.id === this.id ) {

            UI.InGame.updateHealth( this.tank.health );
            UI.InGame.updateAmmo( this.tank.ammo );
            UI.InGame.hideContinueBox();

        }

    };

    public die ( trigger: number ) {

        let killer = PlayerManager.getById( trigger ) || TowerManager.getById( trigger );

        if ( killer ) {

            if ( killer instanceof PlayerCore ) {

                UI.InGame.showKills( killer['username'], this.username, OMath.intToHex( killer.team.color ), OMath.intToHex( this.team.color ) );

            } else {

                UI.InGame.showKills( 'Tower', this.username, OMath.intToHex( killer.team.color ), OMath.intToHex( this.team.color ) );

            }

        }

        if ( this.id === Arena.me.id ) {

            setTimeout( () => {

                if ( killer instanceof TowerCore ) {

                    UI.InGame.showContinueBox( '<br>' + killer.team.name + ' team tower', killer.team.color );

                } else if ( killer instanceof TankCore ) {

                    UI.InGame.showContinueBox( killer.username, killer.team.color );

                } else {

                    UI.InGame.showContinueBox( '<br>stray bullet', '#555' );

                }

            }, 1400 );

        }

    };

    public dispose () {

        this.tank.dispose();
        this.tank = null;

        if ( Arena.me.id !== this.id ) {
        
            this.network.dispose();

        }

    };

    public update ( time: number, delta: number ) {

        this.tank.update( time, delta );

    };

    public init () {

        this.tank.init();
        this.network.init( this );

        //

        if ( Arena.me && Arena.me.id === this.id ) {

            UI.InGame.updateHealth( this.tank.health );
            UI.InGame.updateAmmo( this.tank.ammo );

        }

    };

    //

    constructor ( params ) {

        this.id = params.id;
        this.username = params.login;
        this.team = TeamManager.getById( params.team );
        this.setTank( params.tank, params );

    };

};

//

export { PlayerCore };
