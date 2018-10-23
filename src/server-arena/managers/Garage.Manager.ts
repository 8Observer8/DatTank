/*
 * @author ohmed
 * DatTank Garage manager sys
*/

import { PlayerCore } from '../core/Player.Core';
import { TankObject } from '../objects/core/Tank.Object';

import { BaseTankPart } from '../objects/tanks/Base.TankPart';
import { ArmorTankPart } from '../objects/tanks/Armor.TankPart';
import { CannonTankPart } from '../objects/tanks/Cannon.TankPart';
import { EngineTankPart } from '../objects/tanks/Engine.TankPart';

//

class GarageManagerCore {

    private static instance: GarageManagerCore;

    public tanks: any[];
    public cannons: any[];
    public armors: any[];
    public engines: any[];

    //

    public set ( config: any ) : void {

        this.tanks = config.tanks;
        this.cannons = config.cannons;
        this.armors = config.armors;
        this.engines = config.engines;

    };

    public prepareTank ( params: any, player: PlayerCore ) : TankObject {

        // check params is valid or set default

        params = params || {};

        params.tank = ( this.tanks[ params.tank ] !== undefined ) ? params.tank : 'IS2001';
        const rawTankData = this.tanks[ params.tank ];
        params.cannon = params.cannon || rawTankData.default.cannon;
        params.armor = params.armor || rawTankData.default.armor;
        params.engine = params.engine || rawTankData.default.engine;

        //

        const tankObject = new TankObject( player );
        tankObject.base = new BaseTankPart( this.tanks[ params.tank ] );
        tankObject.cannon = new CannonTankPart( this.cannons[ params.cannon ]);
        tankObject.armor = new ArmorTankPart( this.armors[ params.armor ] );
        tankObject.engine = new EngineTankPart( this.engines[ params.engine ] );
        tankObject.ammo = tankObject.base.ammoCapacity;

        //

        return tankObject;

    };

    //

    constructor () {

        if ( GarageManagerCore.instance ) {

            return GarageManagerCore.instance;

        }

        GarageManagerCore.instance = this;

    };

};

//

export let GarageManager = new GarageManagerCore();
