/*
 * @author ohmed
 * DatTank Player core
*/

import { Game } from '../Game';
import { Logger } from '../utils/Logger';
import { TankObject } from '../objects/core/Tank.Object';
import { Arena } from './Arena.Core';
import { TeamCore } from './Team.Core';
import { TeamManager } from '../managers/arena/Team.Manager';
import { PlayerNetwork } from '../network/Player.Network';
import { UI } from '../ui/Core.UI';
import { BoxManager } from '../managers/objects/Box.Manager';
import { PlayerManager } from '../managers/arena/Player.Manager';

//

export class PlayerCore {

    public id: number;
    public username: string;

    public team: TeamCore;
    public tank: TankObject | null;

    public coins: number;
    public xp: number;
    public level: number = 0;
    public kills: number = 0;
    public score: number = 0;
    public arenaSkill: number = 0;
    public bonusArenaSkills: number = 0;

    private network: PlayerNetwork = new PlayerNetwork();

    //

    public updateStats ( xp: number, coins: number, level: number, levelBonuses: number ) : void {

        if ( Arena.myLevel < level ) {

            alert( 'Level up ' + ( level + 1 ) );

        }

        Arena.myCoins = coins;
        Arena.myXP = xp;
        Arena.myLevel = level;
        Arena.myLevelBonuses = levelBonuses;

        window['userData'].coins = coins;
        window['userData'].xp = xp;
        window['userData'].level = level;
        window['userData'].levelBonuses = levelBonuses;

        UI.InGame.updateCoins( coins );

    };

    public newArenaSkill ( bonusArenaSkills: number ) : void {

        setTimeout( () => {

            UI.InGame.tankUpgradeMenu.showUpgradeMenu( bonusArenaSkills );

        }, 3000 );

        this.bonusArenaSkills = bonusArenaSkills;

    };

    private prepareTank ( params: any ) : void {

        this.tank = new TankObject( params );
        this.tank.player = this;

    };

    public triggerRespawn () : void {

        if ( ! this.tank ) return;

        const selected = JSON.parse( localStorage.getItem('SelectedParts') || '{}' );

        PlayerManager.removeAll();
        BoxManager.removeAll();

        this.network.respawn({
            hull:       Game.GarageConfig.hull[ selected.hull || '' ].nid,
            cannon:     Game.GarageConfig.cannon[ selected.cannon || '' ].nid,
            armor:      Game.GarageConfig.armor[ selected.armor || '' ].nid,
            engine:     Game.GarageConfig.engine[ selected.engine || '' ].nid,
        });

        //

        Logger.newEvent( 'Respawn', 'game' );

    };

    public respawn ( params: any ) : void {

        if ( Arena.me.id === this.id && this.tank ) {

            this.prepareTank( params.tank );
            this.tank.init();

            UI.InGame.updateHealth( this.tank.health );
            UI.InGame.updateAmmo( this.tank.ammo );
            UI.InGame.updateOverheat( 0 );
            UI.InGame.hideContinueBox();

        } else {

            Arena.removePlayer( this.id );

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

        this.id = params.id;
        this.username = params.login;
        this.level = params.level;

        //

        const team = TeamManager.getById( params.team );

        if ( team ) {

            this.team = team;
            this.prepareTank( params.tank );

        }

    };

};
