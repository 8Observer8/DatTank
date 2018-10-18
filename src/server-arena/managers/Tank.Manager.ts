/*
 * @author ohmed
 * DatTank Tank manager sys
*/

import { ArenaCore } from '../core/Arena.Core';
import { TankObject } from '../objects/core/Tank.Object';

//

export class TankManager {

    private tanks: TankObject[] = [];
    public arena: ArenaCore;

    //

    public add ( tank: TankObject ) : void {

        this.tanks.push( tank );

    };

    public remove ( tankId: number ) : void {

        const newTanksList = [];

        for ( let i = 0, il = this.tanks.length; i < il; i ++ ) {

            if ( this.tanks[ i ].id === tankId ) continue;
            newTanksList.push( this.tanks[ i ] );

        }

        this.tanks = newTanksList;

    };

    public getById ( tankId: number ) : TankObject | null {

        for ( let i = 0, il = this.tanks.length; i < il; i ++ ) {

            if ( this.tanks[ i ].id === tankId ) {

                return this.tanks[ i ];

            }

        }

        return null;

    };

    public getTanks () : TankObject[] {

        return this.tanks;

    };

    public update ( delta: number, time: number ) : void {

        for ( let i = 0, il = this.tanks.length; i < il; i ++ ) {

            this.tanks[ i ].update( delta, time );

        }

    };

    //

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};
