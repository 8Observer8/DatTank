/*
 * @author ohmed
 * DatTank Arena network handler
*/

import { Network } from "./../network/Core.Network";
import { Arena } from "./../core/Arena.Core";

//

class ArenaNetwork {

    private newTowers ( data ) {

        let tower;
        let towerBinSize = 6;
        let towers = [];

        //

        for ( let i = 0, il = data.length / towerBinSize; i < il; i ++ ) {

            tower = {
                id:         data[ i * towerBinSize + 0 ],
                team:       data[ i * towerBinSize + 1 ],
                position:   {
                    x:  data[ i * towerBinSize + 2 ],
                    y:  0,
                    z:  data[ i * towerBinSize + 3 ]
                },
                rotation:   data[ i * towerBinSize + 4 ] / 1000,
                health:     data[ i * towerBinSize + 5 ]
            };

            towers.push( tower );

        }

        Arena.newTowers( towers );

    };

    private newPlayers ( data ) {

        let players = [];
        let player;
        let playerBinSize = 23;

        for ( let i = 0, il = data.length / playerBinSize; i < il; i ++ ) {

            player = {
                id:             data[ i * playerBinSize + 0 ],
                team:           data[ i * playerBinSize + 1 ],
                position:   {
                    x:  data[ i * playerBinSize + 2 ],
                    y:  0,
                    z:  data[ i * playerBinSize + 3 ]
                },
                rotation:       data[ i * playerBinSize + 4 ] / 1000,
                rotationTop:    data[ i * playerBinSize + 5 ] / 1000,
                health:         data[ i * playerBinSize + 6 ],
                moveDirection:  {
                    x:  data[ i * playerBinSize + 7 ],
                    y:  data[ i * playerBinSize + 8 ]
                },
                tank:   data[ i * playerBinSize + 9 ],
                login:  ''
            };

            for ( var j = 0; j < 13; j ++ ) {

                player.login += String.fromCharCode( data[ i * playerBinSize + 10 + j ] );

            }

            players.push( player );

        }

        Arena.newPlayers( players );

    };

    private newBoxes ( data ) {

        let boxes = [];
        let box;
        let boxBinSize = 4;

        //

        for ( let i = 0, il = data.length / boxBinSize; i < il; i ++ ) {

            box = {
                id:         data[ i * boxBinSize + 0 ],
                type:       data[ i * boxBinSize + 1 ],
                position:   {
                    x:  data[ i * boxBinSize + 2 ],
                    y:  20,
                    z:  data[ i * boxBinSize + 3 ]
                }
            };

            boxes.push( box );

        }

        Arena.newBoxes( boxes );

    };

    private explosion ( data ) {

        // todo

    };

    private boxRemove ( data ) {

        // todo

    };

    private playerLeft ( data ) {

        // todo

    };

    private updateLeaderboard ( data ) {

        // todo

    };

    //

    public init () {

        Network.addMessageListener( 'ArenaBulletHit', this.explosion.bind( this ) );
        Network.addMessageListener( 'ArenaBoxRemove', this.boxRemove.bind( this ) );

        Network.addMessageListener( 'ArenaPlayersInRange', this.newPlayers.bind( this ) );
        Network.addMessageListener( 'ArenaTowersInRange', this.newTowers.bind( this ) );
        Network.addMessageListener( 'ArenaBoxesInRange', this.newBoxes.bind( this ) );

        Network.addMessageListener( 'ArenaPlayerLeft', this.playerLeft.bind( this ) );
        Network.addMessageListener( 'ArenaLeaderboardUpdate', this.updateLeaderboard.bind( this ) );

    };

};

//

export { ArenaNetwork };
