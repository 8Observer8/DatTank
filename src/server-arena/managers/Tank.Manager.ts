/*
 * @author ohmed
 * DatTank Tank manager sys
*/

import { ArenaCore } from "./../core/Arena.Core";
import { TankObject } from "./../objects/core/Tank.Object";

//

class TankManager {

    private tanks: Array<TankObject> = [];

    public arena: ArenaCore;

    //

    public add ( tank: TankObject ) {

        this.tanks.push( tank );

    };

    public remove ( tankId: number ) {

        let newTanksList = [];

        for ( let i = 0, il = this.tanks.length; i < il; i ++ ) {

            if ( this.tanks[ i ].id === tankId ) continue;
            newTanksList.push( this.tanks[ i ] );

        }

        this.tanks = newTanksList;

    };

    public getById ( tankId: number ) {

        for ( let i = 0, il = this.tanks.length; i < il; i ++ ) {

            if ( this.tanks[ i ].id === tankId ) {

                return this.tanks[ i ];

            }

        }

        return null;

    };

    public getTanks () {

        return this.tanks;

    };

    public update ( delta: number, time: number ) {

        for ( let i = 0, il = this.tanks.length; i < il; i ++ ) {

            this.tanks[ i ].update( delta, time );

        }

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};

//

export { TankManager };
