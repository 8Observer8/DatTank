/*
 * @author ohmed
 * DatTank Garage manager sys
*/

import { PlayerCore } from '../core/Player.Core';
import { TankObject } from '../objects/core/Tank.Object';

import { HullTankPart } from '../objects/tanks/Hull.TankPart';
import { ArmorTankPart } from '../objects/tanks/Armor.TankPart';
import { CannonTankPart } from '../objects/tanks/Cannon.TankPart';
import { EngineTankPart } from '../objects/tanks/Engine.TankPart';

//

class GarageManagerCore {

    private static instance: GarageManagerCore;

    public hull: any[];
    public cannon: any[];
    public armor: any[];
    public engine: any[];

    public levels: { [ key: number ]: number };
    public arenaLevels: { [ key: number ]: { score: number } };
    public arenaUpgrades: { [ key: number ]: { armor: number, cannon: number, maxSpeed: number, power: number, rpm: number } };

    //

    public set ( config: any ) : void {

        this.hull = config.hull;
        this.cannon = config.cannon;
        this.armor = config.armor;
        this.engine = config.engine;

        this.levels = config.levels;
        this.arenaLevels = config.arenaLevels;
        this.arenaUpgrades = config.arenaUpgrades;

    };

    public getBaseById ( id: number ) : any {

        for ( const i in this.hull ) {

            if ( this.hull[ i ].nid === id ) {

                return this.hull[ i ];

            }

        }

        return null;

    };

    public getCannonById ( id: number ) : any {

        for ( const i in this.cannon ) {

            if ( this.cannon[ i ].nid === id ) {

                return this.cannon[ i ];

            }

        }

        return null;

    };

    public getArmorById ( id: number ) : any {

        for ( const i in this.armor ) {

            if ( this.armor[ i ].nid === id ) {

                return this.armor[ i ];

            }

        }

        return null;

    };

    public getEngineById ( id: number ) : any {

        for ( const i in this.engine ) {

            if ( this.engine[ i ].nid === id ) {

                return this.engine[ i ];

            }

        }

        return null;

    };

    public prepareTank ( availableParts: any, params: any, player: PlayerCore ) : TankObject {

        // check params is valid and set default if not [cheater detected]

        params = params || {};

        if ( player.socket ) {

            if ( ! availableParts.hull[ params.hull ] || ! availableParts.cannon[ params.cannon ] || ! availableParts.armor[ params.armor ] || ! availableParts.engine[ params.engine ] ) {

                params.base = 'IS2001';
                const rawTankData = this.hull[ params.hull ];

                params.cannon = rawTankData.default.cannon;
                params.armor = rawTankData.default.armor;
                params.engine = rawTankData.default.engine;

                player.network.warnCheater();

            }

        }

        //

        const tankObject = new TankObject( player );
        tankObject.hull = new HullTankPart( this.hull[ params.hull ], availableParts ? availableParts.hull[ params.hull ].level : 1 );
        tankObject.cannon = new CannonTankPart( this.cannon[ params.cannon ], availableParts ? availableParts.cannon[ params.cannon ].level : 1 );
        tankObject.armor = new ArmorTankPart( this.armor[ params.armor ], availableParts ? availableParts.armor[ params.armor ].level : 1 );
        tankObject.engine = new EngineTankPart( this.engine[ params.engine ], availableParts ? availableParts.engine[ params.engine ].level : 1 );
        tankObject.ammo = tankObject.hull.ammoCapacity;

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
