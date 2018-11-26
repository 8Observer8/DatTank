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

    public bases: any[];
    public cannons: any[];
    public armors: any[];
    public engines: any[];

    public levels: { [ key: number ]: number };
    public arenaLevels: { [ key: number ]: { score: number } };
    public arenaUpgrades: { [ key: number ]: { armor: number, cannon: number, maxSpeed: number, power: number, rpm: number } };

    //

    public set ( config: any ) : void {

        this.bases = config.tanks;
        this.cannons = config.cannons;
        this.armors = config.armors;
        this.engines = config.engines;

        this.levels = config.levels;
        this.arenaLevels = config.arenaLevels;
        this.arenaUpgrades = config.arenaUpgrades;

    };

    public getBaseById ( id: number ) : any {

        for ( const i in this.bases ) {

            if ( this.bases[ i ].nid === id ) {

                return this.bases[ i ];

            }

        }

        return null;

    };

    public getCannonById ( id: number ) : any {

        for ( const i in this.cannons ) {

            if ( this.cannons[ i ].nid === id ) {

                return this.cannons[ i ];

            }

        }

        return null;

    };

    public getArmorById ( id: number ) : any {

        for ( const i in this.armors ) {

            if ( this.armors[ i ].nid === id ) {

                return this.armors[ i ];

            }

        }

        return null;

    };

    public getEngineById ( id: number ) : any {

        for ( const i in this.engines ) {

            if ( this.engines[ i ].nid === id ) {

                return this.engines[ i ];

            }

        }

        return null;

    };

    public prepareTank ( availableParts: any, params: any, player: PlayerCore ) : TankObject {

        // check params is valid and set default if not [cheater detected]

        params = params || {};

        if ( player.socket ) {

            if ( ! availableParts.tank[ params.base ] || ! availableParts.cannon[ params.cannon ] || ! availableParts.armor[ params.armor ] || ! availableParts.engine[ params.engine ] ) {

                params.base = 'IS2001';
                const rawTankData = this.bases[ params.base ];

                params.cannon = rawTankData.default.cannon;
                params.armor = rawTankData.default.armor;
                params.engine = rawTankData.default.engine;

                player.network.warnCheater();

            }

        }

        //

        const tankObject = new TankObject( player );
        tankObject.base = new BaseTankPart( this.bases[ params.base ] );
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
