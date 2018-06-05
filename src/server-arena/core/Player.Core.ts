/*
 * @author ohmed
 * DatTank Player Core
*/

import * as ws from "ws";

import * as OMath from "./../OMath/Core.OMath";
import { ArenaCore } from "./Arena.Core";
import { BotCore } from "./Bot.Core";
import { TeamCore } from "./Team.Core";
import { TankObject } from "./../objects/core/Tank.Object";

import { IS2Tank } from "./../objects/tanks/IS2.Tank";
import { T29Tank } from "./../objects/tanks/T29.Tank";
import { T44Tank } from "./../objects/tanks/T44.Tank";
import { T54Tank } from "./../objects/tanks/T54.Tank";

//

class PlayerCore {

    public static Dead: number = 0;
    public static Alive: number = 1;

    public arena: ArenaCore;
    public bot: BotCore;

    public id: number;
    public socket: ws;
    public login: string;
    public status: number;
    public kills: number = 0;
    public death: number = 0;
    public score: number = 0;
    public level: number = 0;
    public bonusLevels = 0;

    public team: TeamCore;
    public tank: TankObject;

    public readonly type: string = 'Player';

    //

    public selectTank ( tankName?: string ) {

        let TanksList = {
            'IS2':    IS2Tank,
            'T29':    T29Tank,
            'T44':    T44Tank,
            'T54':    T54Tank
        };

        //

        this.tank = new TanksList[ tankName ]();
        this.tank.moveSpeed = this.tank.originalMoveSpeed * this.tank.speed / 40;
        this.tank.ammo = this.tank.ammoCapacity;

    };

    public respawn ( tankName?: string ) {

        tankName = tankName || ( this.tank ? this.tank.title : 'T44' );

        this.selectTank( tankName );
        this.tank.setRespawnPosition();
        this.status = PlayerCore.Alive;
        this.bonusLevels = 0;
        this.level = 0;

        // todo

        this.changeScore( - Math.floor( 1 * this.score / 3 ) );
        this.arena.updateLeaderboard();

    };

    public changeScore ( delta: number ) {

        // todo

    };

    public update ( delta: number, time: number ) {

        // todo

    };

    public dispose () {

        // todo

    };

    private getGuestLogin () {

        let login = '';
        let loginAttempt = 1;
        let players = this.arena.playerManager.getPlayers();

        while ( ! login ) {

            login = 'player ' + loginAttempt;

            for ( let i = 0, il = players.length; i < il; i ++ ) {

                if ( players[ i ].login === login ) {

                    login = null;
                    loginAttempt ++;
                    break;

                }

            }

        }

        return login;

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        this.arena = arena;

        this.login = params.login || this.getGuestLogin();
        this.status = PlayerCore.Alive;
        this.socket = params.socket || null;

        if ( this.socket ) {

            this.socket['player'] = this;
            this.socket['arena'] = arena;

        }

        this.selectTank( params.tank );

    };

};

//

export { PlayerCore };
