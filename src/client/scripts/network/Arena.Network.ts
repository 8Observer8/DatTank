/*
 * @author ohmed
 * DatTank Arena network handler
*/

import * as OMath from '../OMath/Core.OMath';
import { Network } from '../network/Core.Network';
import { Arena } from '../core/Arena.Core';
import { BoxManager } from '../managers/objects/Box.Manager';
import { ControlsManager } from '../managers/other/Control.Manager';
import { PlayerManager } from '../managers/arena/Player.Manager';
import { UI } from '../ui/Core.UI';
import { TowerManager } from '../managers/objects/Tower.Manager';

//

export class ArenaNetwork {

    private playerDied ( data: any ) : void {

        const player = data.player;
        const killer = data.killer;

        Arena.playerKilled( player, killer );

    };

    private newExplosion ( data: number[] ) : void {

        const bulletId = data[0];
        const x = data[1];
        const y = 26;
        const z = data[2];
        const type = data[3];

        Arena.newExplosion( new OMath.Vec3( x, y, z ), bulletId, type );

    };

    private newTowers ( data: number[] ) : void {

        let tower;
        const towerBinSize = 7;
        const towers = [];

        //

        const towerCount = data[0];
        let offset = 1;

        for ( let i = 0, il = towerCount; i < il; i ++ ) {

            tower = {
                id:             data[ offset + 0 ],
                team:           data[ offset + 1 ],
                position:   {
                    x:      data[ offset + 2 ],
                    y:      0,
                    z:      data[ offset + 3 ],
                },
                rotation:       data[ offset + 4 ] / 1000,
                health:         data[ offset + 5 ],
                newRotation:    data[ offset + 6 ] / 1000,
            };

            towers.push( tower );
            offset += towerBinSize;

        }

        //

        const removedTowers = [];

        for ( let i = offset, il = data.length; i < il; i ++ ) {

            removedTowers.push( data[ i ] );

        }

        //

        TowerManager.remove( removedTowers );
        Arena.newTowers( towers );

    };

    private newTanks ( data: number[] ) : void {

        let player;
        const players = [];
        let offset = 1;
        const tanksCount = data[0];

        for ( let i = 0; i < tanksCount; i ++ ) {

            player = {
                id:                     data[ offset + 0 ],
                login:                  '',
                level:                  data[ offset + 1 ],
                team:                   data[ offset + 2 ],
                tank:           {
                    id:                 data[ offset + 3 ],
                    moveDirection:  {
                        x:              data[ offset + 4 ],
                        y:              data[ offset + 5 ],
                    },
                    position:   {
                        x:              data[ offset + 6 ],
                        y:              data[ offset + 7 ],
                        z:              data[ offset + 8 ],
                    },
                    velocity:   {
                        x:              data[ offset +  9 ] / 10,
                        y:              data[ offset + 10 ] / 10,
                        z:              data[ offset + 11 ] / 10,
                    },
                    rotation:           data[ offset + 12 ] / 1000,
                    health:             data[ offset + 13 ],
                    ammo:               0,
                    hull:   {
                        nid:            data[ offset + 14 ],
                        speedCoef:      data[ offset + 15 ],
                        ammoCapacity:   0,
                        armorCoef:      0,
                    },
                    cannon: {
                        nid:            data[ offset + 16 ],
                        range:          data[ offset + 17 ],
                        rpm:            0,
                        overheat:       0,
                    },
                    armor: {
                        nid:            data[ offset + 18 ],
                        armor:          data[ offset + 19 ],
                    },
                    engine: {
                        nid:            data[ offset + 20 ],
                        maxSpeed:       data[ offset + 21 ],
                        power:          data[ offset + 22 ] * 100,
                    },
                },
            };

            //

            offset += 23;

            for ( let j = 0; j < 13; j ++ ) {

                if ( data[ offset + j ] !== 0 ) {

                    player.login += String.fromCharCode( data[ offset + j ] );

                }

            }

            offset += 13;

            //

            if ( Arena.meId === player.id ) {

                player.tank.ammo = data[ offset + 0 ];
                player.tank.hull.ammoCapacity = data[ offset + 1 ];
                player.tank.hull.armorCoef = data[ offset + 2 ];
                player.tank.cannon.rpm = data[ offset + 3 ];
                player.tank.cannon.overheat = data[ offset + 4 ];

                offset += 5;

                players.unshift( player );

            } else {

                players.push( player );

            }

        }

        //

        const removedPlayers = [];

        for ( let i = offset, il = data.length; i < il; i ++ ) {

            removedPlayers.push( data[ i ] );

        }

        //

        PlayerManager.remove( removedPlayers );
        Arena.newPlayers( players );

    };

    private newBoxes ( data: number[] ) : void {

        const boxes = [];
        let box;
        const boxBinSize = 4;

        //

        const boxCount = data[0];
        let offset = 1;

        for ( let i = 0, il = boxCount; i < il; i ++ ) {

            box = {
                id:         data[ offset + 0 ],
                type:       data[ offset + 1 ],
                position:   {
                    x:  data[ offset + 2 ],
                    y:  20,
                    z:  data[ offset + 3 ],
                },
            };

            boxes.push( box );
            offset += boxBinSize;

        }

        //

        const removedBoxes = [];

        for ( let i = offset, il = data.length; i < il; i ++ ) {

            removedBoxes.push( data[ i ] );

        }

        //

        BoxManager.remove( removedBoxes );
        Arena.newBoxes( boxes );

    };

    private boxRemove ( data: number[] ) : void {

        const boxId = data[0];
        const playerId = data[1];
        const box = BoxManager.getBoxById( boxId );

        if ( box ) {

            box.pick( playerId );

        }

    };

    private playerLeft ( data: number[] ) : void {

        const playerId = data[0];
        const player = PlayerManager.getById( playerId );

        if ( player ) {

            Arena.removePlayer( player.id );

        }

    };

    private updateLeaderboard ( data: any ) : void {

        Arena.updateLeaderBoard( data.players, data.teams );

    };

    private joinArena ( data: any ) : void {

        Arena.init( data );
        UI.Landing.hideLoader();
        UI.InGame.showViewport();

        setTimeout( () => {

            ControlsManager.init();

        }, 100 );

    };

    private newChatMessage ( data: any ) : void {

        UI.Chat.newMessage( data );

    };

    private setKillSerie ( data: any ) : void {

        const playerId = data.id;
        const playerLogin = data.login;
        const teamId = data.team;
        const serieLength = data.serie;

        UI.InGame.showKillSerie( playerId, playerLogin, teamId, serieLength );

    };

    //

    public init () : void {

        Network.addMessageListener( 'ArenaKillSerie', this.setKillSerie.bind( this ) );
        Network.addMessageListener( 'ArenaJoinResponse', this.joinArena.bind( this ) );
        Network.addMessageListener( 'ArenaBulletHit', this.newExplosion.bind( this ) );
        Network.addMessageListener( 'ArenaBoxRemove', this.boxRemove.bind( this ) );
        Network.addMessageListener( 'ArenaTanksInRange', this.newTanks.bind( this ) );
        Network.addMessageListener( 'ArenaTowersInRange', this.newTowers.bind( this ) );
        Network.addMessageListener( 'ArenaBoxesInRange', this.newBoxes.bind( this ) );
        Network.addMessageListener( 'ArenaPlayerLeft', this.playerLeft.bind( this ) );
        Network.addMessageListener( 'ArenaLeaderboardUpdate', this.updateLeaderboard.bind( this ) );
        Network.addMessageListener( 'ArenaPlayerDied', this.playerDied.bind( this ) );
        Network.addMessageListener( 'ArenaChatMessage', this.newChatMessage.bind( this ) );

    };

};
