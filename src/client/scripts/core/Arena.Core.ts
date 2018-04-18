/*
 * @author ohmed
 * DatTank Arena core
*/

import { TeamManager } from "./../managers/Team.Manager";
import { PlayerManager } from "./../managers/Player.Manager";
import { TowerManager } from "./../managers/Tower.Manager";
import { BoxManager } from "./../managers/Box.Manager";
import { DecorationManager } from "./../managers/Decoration.Manager";
import { ControlsManager } from "./../managers/Control.Manager";
import { ExplosionManager } from "./../managers/Explosion.Manager";

import * as OMath from "./../OMath/Core.OMath";
import { GfxCore } from "./../graphics/Core.Gfx";
import { PlayerCore } from "./Player.Core";
import { TowerCore } from "./objects/Tower.Core";
import { ArenaNetwork } from "../network/Arena.Network";

//

class ArenaCore {

    private static instance: ArenaCore;

    private serverIP: string;
    private serverID: string;

    public me: PlayerCore;
    public meId: number;

    private prevUpdateTime: number;
    private time: number;
    private updateTimeRemainder: number = 0;
    private updateInterval: number;
    private updateIntervalDuration: number = 20;

    private network: ArenaNetwork = new ArenaNetwork();

    //

    public preInit ( ip: string, id: string ) {

        this.serverIP = ip;
        this.serverID = id;

        //

        this.network.init();

    };

    public init ( params ) {

        this.meId = params.me.id;

        // setup GfxCore

        GfxCore.clear();
        GfxCore.init();

        // setup managers

        TeamManager.init( params.teams );
        PlayerManager.init();
        TowerManager.init();
        BoxManager.init();
        DecorationManager.init( params.decorations );

        //

        this.prevUpdateTime = Date.now();
        this.time = Date.now();
        this.updateInterval = setInterval( this.update.bind( this ), this.updateIntervalDuration );

    };

    public updateLeaderBoard ( data ) {

        // ui.updateLeaderboard( data.players );
        // ui.updateTeamScore( data.teams );

    };

    public removePlayer ( player ) {

        PlayerManager.remove( PlayerManager.getById( player.id ) );

    };

    public newExplosion ( position: OMath.Vec3 ) {

        ExplosionManager.showExplosion( position );

    };

    public newTowers ( towers: Array<any> ) {

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            TowerManager.remove( TowerManager.getById( towers[ i ].id ) );
            TowerManager.add( towers[ i ] );

        }

    };

    public newPlayers ( players: Array<any> ) {

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            PlayerManager.remove( PlayerManager.getById( players[ i ].id ) );
            PlayerManager.add( new PlayerCore( players[ i ] ) );

        }

    };

    public newBoxes ( boxes: Array<any> ) {

        for ( let i = 0, il = boxes.length; i < il; i ++ ) {

            BoxManager.remove( BoxManager.getBoxById( boxes[ i ].id ) );
            BoxManager.add( boxes[ i ] );

        }

    };

    public dispose () {

        clearInterval( this.updateInterval );

    };

    private update ( time: number, delta: number ) {

        var time = Date.now();
        var delta = time - this.prevUpdateTime + this.updateTimeRemainder;

        this.updateTimeRemainder = delta % this.updateIntervalDuration;
        delta = delta - this.updateTimeRemainder;
        this.prevUpdateTime = time;

        //

        PlayerManager.update( time, delta );

        //

        for ( var i = 0, il = Math.floor( delta / this.updateIntervalDuration ); i < il; i ++ ) {

            this.time += delta;
            this.update( this.time, this.updateIntervalDuration );
    
        }

    };

    //

    constructor () {

        if ( ArenaCore.instance ) {

            return ArenaCore.instance;

        }

        ArenaCore.instance = this;

    };

};

//

export let Arena = new ArenaCore();
