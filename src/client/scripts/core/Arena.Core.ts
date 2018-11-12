/*
 * @author ohmed
 * DatTank Arena core
*/

import { TeamManager } from '../managers/Team.Manager';
import { PlayerManager } from '../managers/Player.Manager';
import { TowerManager } from '../managers/Tower.Manager';
import { BoxManager } from '../managers/Box.Manager';
import { DecorationManager } from '../managers/Decoration.Manager';
import { ExplosionManager } from '../managers/Explosion.Manager';

import * as OMath from '../OMath/Core.OMath';
import { GfxCore } from '../graphics/Core.Gfx';
import { PlayerCore } from './Player.Core';
import { ArenaNetwork } from '../network/Arena.Network';
import { BulletManager } from '../managers/Bullet.Manager';
import { CollisionManager } from '../managers/Collision.Manager';
import { UI } from '../ui/Core.UI';
import { TeamCore } from './Team.Core';

//

class ArenaCore {

    public static instance: ArenaCore;

    public me: PlayerCore;
    public meId: number;
    public myCoins: number;
    public myXP: number;

    private updateInterval: number;
    private updateIntervalDuration: number = 60;
    private viewRange: number = 780;

    private network: ArenaNetwork = new ArenaNetwork();

    //

    public preInit ( ip: string, id: string ) : void {

        this.network.init();

    };

    public init ( params: any ) : void {

        this.meId = params.me.id;

        this.myCoins = params.me.coins;
        this.myXP = params.me.xp;
        UI.InGame.updateXPCoins( this.myXP, this.myCoins );

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

    public removePlayer ( player: PlayerCore ) : void {

        PlayerManager.remove( [ player.id ] );

    };

    public newExplosion ( position: OMath.Vec3, bulletId: number, explosionType: number ) : void {

        ExplosionManager.showExplosion( position, explosionType );
        BulletManager.hideBullet( bulletId );

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

    private removeOutOfRangeObjects () : void {

        // remove out of range players

        const playersToRemove = [];
        const players = PlayerManager.get();

        for ( let i = 0, il = players.length; i < il; i ++ ) {

            const player = players[ i ];

            if ( ! player || player.id === this.meId ) continue;
            if ( ! player.tank || ! this.me || ! this.me.tank ) continue;

            if ( player.tank.position.distanceTo( this.me.tank.position ) > this.viewRange ) {

                playersToRemove.push( player.id );

            }

        }

        PlayerManager.remove( playersToRemove );

        // remove out of range towers

        const towersToRemove = [];
        const towers = TowerManager.get();

        for ( let i = 0, il = towers.length; i < il; i ++ ) {

            const tower = towers[ i ];
            if ( ! tower || ! this.me.tank ) continue;

            if ( tower.position.distanceTo( this.me.tank.position ) > this.viewRange ) {

                towersToRemove.push( tower.id );

            }

        }

        TowerManager.remove( towersToRemove );

        // remove out of range boxes

        const boxesToRemove = [];
        const boxes = BoxManager.get();

        for ( let i = 0, il = boxes.length; i < il; i ++ ) {

            const box = boxes[ i ];
            if ( ! box || ! this.me.tank ) continue;

            if ( box.position.distanceTo( this.me.tank.position ) > this.viewRange ) {

                boxesToRemove.push( box.id );

            }

        }

        BoxManager.remove( boxesToRemove );

    };

    private update ( time: number, delta: number ) : void {

        CollisionManager.update( time, delta );
        this.removeOutOfRangeObjects();

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
