/*
 * @author ohmed
 * DatTank Arena tower manager
*/

import { TowerCore } from "../core/objects/Tower.Core";

//

class TowerManager {

    private towers: Array<TowerCore> = [];

    //

    public add ( tower: TowerCore ) {

        this.towers.push( tower );

    };

    public remove ( tower: TowerCore ) {

        var newTowerList = [];

        for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

            if ( this.towers[ i ].id === tower.id ) {

                tower.dispose();
                continue;

            }

            newTowerList.push( this.towers[ i ] );

        }

        this.towers = newTowerList;

    };

    public getById ( towerId: number ) {

        for ( var i = 0, il = this.towers.length; i < il; i ++ ) {

            if ( this.towers[ i ].id === towerId ) {

                return this.towers[ i ];

            }

        }

        return false;

    };

    public init () {

        // todo

    };

};

//

export { TowerManager };
