/*
 * @author ohmed
 * DatTank Arena network handler
*/

import * as OMath from '../OMath/Core.OMath';
import { Network } from '../network/Core.Network';
import { Arena } from '../core/Arena.Core';
import { BoxManager } from '../managers/Box.Manager';
import { ControlsManager } from '../managers/Control.Manager';
import { PlayerManager } from '../managers/Player.Manager';
import { UI } from '../ui/Core.UI';

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

        for ( let i = 0, il = data.length / towerBinSize; i < il; i ++ ) {

            tower = {
                id:             data[ i * towerBinSize + 0 ],
                team:           data[ i * towerBinSize + 1 ],
                position:   {
                    x:      data[ i * towerBinSize + 2 ],
                    y:      0,
                    z:      data[ i * towerBinSize + 3 ],
                },
                rotation:       data[ i * towerBinSize + 4 ] / 1000,
                health:         data[ i * towerBinSize + 5 ],
                newRotation:    data[ i * towerBinSize + 6 ] / 1000,
            };

            towers.push( tower );

        }

        Arena.newTowers( towers );

    };

    private newTanks ( data: number[] ) : void {

        const players = [];
        let player;
        const playerBinSize = 38;

        for ( let i = 0, il = data.length / playerBinSize; i < il; i ++ ) {

            player = {
                id:             data[ i * playerBinSize + 11 ],
                login:          '',
                team:           data[ i * playerBinSize + 1 ],
                tank:           {
                    id:             data[ i * playerBinSize + 0 ],
                    position:   {
                        x:  data[ i * playerBinSize + 2 ],
                        y:  data[ i * playerBinSize + 3 ],
                        z:  data[ i * playerBinSize + 4 ],
                    },
                    rotation:       ( data[ i * playerBinSize + 5 ] / 1000 ) % ( 2 * Math.PI ),
                    rotationTop:    data[ i * playerBinSize + 6 ] / 1000,
                    health:         data[ i * playerBinSize + 7 ],
                    moveDirection:  {
                        x:  data[ i * playerBinSize + 8 ],
                        y:  data[ i * playerBinSize + 9 ],
                    },
                    ammo:   data[ i * playerBinSize + 10 ],
                    base:   {
                        nid:            data[ i * playerBinSize + 12 ],
                        speedCoef:      data[ i * playerBinSize + 13 ],
                        ammoCapacity:   data[ i * playerBinSize + 14 ],
                        armorCoef:      data[ i * playerBinSize + 15 ],
                    },
                    cannon: {
                        nid:        data[ i * playerBinSize + 16 ],
                        range:      data[ i * playerBinSize + 17 ],
                        rpm:        data[ i * playerBinSize + 18 ],
                        overheat:   data[ i * playerBinSize + 19 ],
                    },
                    armor: {
                        nid:    data[ i * playerBinSize + 20 ],
                        armor:  data[ i * playerBinSize + 21 ],
                    },
                    engine: {
                        nid:        data[ i * playerBinSize + 22 ],
                        maxSpeed:   data[ i * playerBinSize + 23 ],
                        power:      data[ i * playerBinSize + 24 ],
                    },
                },
            };

            for ( let j = 0; j < 13; j ++ ) {

                if ( data[ i * playerBinSize + 25 + j ] !== 0 ) {

                    player.login += String.fromCharCode( data[ i * playerBinSize + 25 + j ] );

                }

            }

            players.push( player );

        }

        Arena.newPlayers( players );

    };

    private newBoxes ( data: number[] ) : void {

        const boxes = [];
        let box;
        const boxBinSize = 4;

        //

        for ( let i = 0, il = data.length / boxBinSize; i < il; i ++ ) {

            box = {
                id:         data[ i * boxBinSize + 0 ],
                type:       data[ i * boxBinSize + 1 ],
                position:   {
                    x:  data[ i * boxBinSize + 2 ],
                    y:  20,
                    z:  data[ i * boxBinSize + 3 ],
                },
            };

            boxes.push( box );

        }

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

            Arena.removePlayer( player );

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
