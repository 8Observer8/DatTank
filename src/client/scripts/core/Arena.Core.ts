/*
 * @author ohmed
 * DatTank Arena core
*/

import { TeamManager } from '../managers/arena/Team.Manager';
import { PlayerManager } from '../managers/arena/Player.Manager';
import { TowerManager } from '../managers/objects/Tower.Manager';
import { BoxManager } from '../managers/objects/Box.Manager';
import { DecorationManager } from '../managers/objects/Decoration.Manager';
import { ExplosionManager } from '../graphics/managers/Explosion.Manager';

import * as OMath from '../OMath/Core.OMath';
import { GfxCore } from '../graphics/Core.Gfx';
import { PlayerCore } from './Player.Core';
import { ArenaNetwork } from '../network/Arena.Network';
import { BulletShotManager } from '../graphics/managers/BulletShot.Manager';
import { CollisionManager } from '../managers/arena/Collision.Manager';
import { UI } from '../ui/Core.UI';
import { TeamCore } from './Team.Core';

//

class ArenaCore {

    public static instance: ArenaCore;

    public me: PlayerCore;
    public meId: number;
    public myCoins: number;
    public myXP: number;
    public myLevel: number;
    public myLevelBonuses: number;

    private updateInterval: number;
    private updateIntervalDuration: number = 20;

    private network: ArenaNetwork = new ArenaNetwork();

    //

    public preInit ( ip: string, id: string ) : void {

        this.network.init();

    };

    public init ( params: any ) : void {

        this.meId = params.me.id;
        this.myCoins = params.me.coins;

        UI.InGame.updateCoins( this.myCoins );

        // setup teams

        TeamManager.init( params.teams );

        // setup GfxCore

        GfxCore.clear();
        GfxCore.init();

        // setup all other managers

        PlayerManager.init();
        TowerManager.init();
        BoxManager.init();
        DecorationManager.init( params.decorations );

        //

        this.updateInterval = setInterval( this.update.bind( this ), this.updateIntervalDuration ) as any;

    };

    public updateLeaderBoard ( players: PlayerCore[], teams: TeamCore[] ) : void {

        UI.InGame.updateLeaderboard( players );
        UI.InGame.updateTeamScore( teams );

    };

    public playerKilled ( player: any, killer: any ) : void {

        const playerTeam = TeamManager.getById( player.teamId );
        const killerTeam = TeamManager.getById( killer.teamId );

        if ( ! killer || ! killerTeam || ! playerTeam ) {

            return;

        }

        if ( killer.type === 'player' ) {

            UI.InGame.showKills( killer.id, killer.login, player.login, OMath.intToHex( killerTeam.color ), OMath.intToHex( playerTeam.color ) );

        } else if ( killer.type === 'tower' ) {

            UI.InGame.showKills( killer.id, 'Tower', player.login, OMath.intToHex( killerTeam.color ), OMath.intToHex( playerTeam.color ) );

        }

        //

        if ( player.id === Arena.me.id ) {

            setTimeout( () => {

                if ( ! killerTeam ) {

                    return;

                }

                if ( killer.type === 'tower' ) {

                    UI.InGame.showContinueBox( '<br>' + killerTeam.name + ' team tower', OMath.intToHex( killerTeam.color ) );

                } else if ( killer.type === 'player' ) {

                    UI.InGame.showContinueBox( killer.login, OMath.intToHex( killerTeam.color ) );

                } else {

                    UI.InGame.showContinueBox( '<br>stray bullet', '#555' );

                }

            }, 1400 );

        }

    };

    public removePlayer ( playerId: number ) : void {

        PlayerManager.remove( [ playerId ] );

    };

    public newExplosion ( position: OMath.Vec3, bulletId: number, explosionType: number ) : void {

        ExplosionManager.showExplosion( position, explosionType );
        BulletShotManager.hideBullet( bulletId );

    };

    public newTowers ( towers: any[] ) : void {

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            TowerManager.remove( [ towers[ i ].id ] );
            TowerManager.add( towers[ i ] );

        }

    };

    public newPlayers ( players: any[] ) : void {

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            if ( Arena.me && players[ i ].id === Arena.me.id ) continue;
            PlayerManager.remove( [ players[ i ].id ] );
            PlayerManager.add( new PlayerCore( players[ i ] ) );

        }

    };

    public newBoxes ( boxes: any[] ) : void {

        for ( let i = 0, il = boxes.length; i < il; i ++ ) {

            BoxManager.remove( [ boxes[ i ].id ] );
            BoxManager.add( boxes[ i ] );

        }

    };

    public dispose () : void {

        clearInterval( this.updateInterval );

    };

    private update ( time: number, delta: number ) : void {

        CollisionManager.update( time, delta );

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
