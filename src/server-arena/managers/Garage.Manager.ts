/*
 * @author ohmed
 * DatTank Garage manager sys
*/

import { TankObject } from "./../objects/core/Tank.Object";
import { ArmorGarage } from "./../objects/garage/core/Armor.Garage";
import { CannonGarage } from "./../objects/garage/core/Cannon.Garage";
import { EngineGarage } from "./../objects/garage/core/Engine.Garage";

//

import { DTEK72sTank } from "./../objects/garage/tanks/DTEK72.Tank";
import { IS2001Tank } from "./../objects/garage/tanks/IS2001.Tank";
import { MG813Tank } from "./../objects/garage/tanks/MG813.Tank";
import { OrbitT32sTank } from "./../objects/garage/tanks/OrbitT32s.Tank";
import { RiperX3Tank } from "./../objects/garage/tanks/RiperX3.Tank";
import { TigerS8Tank } from "./../objects/garage/tanks/TigerS8.Tank";

const TanksList = {
    'DTEK72s':      DTEK72sTank,
    'IS2001':       IS2001Tank,
    'MG813':        MG813Tank,
    'OrbitT32s':    OrbitT32sTank,
    'RiperX3':      RiperX3Tank,
    'TigerS8':      TigerS8Tank
};

//

import { PlasmaG1Cannon } from "./../objects/garage/cannons/PlasmaG1.Cannon";
import { PlasmaG2Cannon } from "./../objects/garage/cannons/PlasmaG2.Cannon";
import { PlasmaDoubleCannon } from "./../objects/garage/cannons/PlasmaDouble.Cannon";
import { PlasmaTrippleCannon } from "./../objects/garage/cannons/PlasmaTripple.Cannon";
import { PlasmaZeroCannon } from "./../objects/garage/cannons/PlasmaZero.Cannon";
import { RazerV1Cannon } from "./../objects/garage/cannons/RazerV1.Cannon";
import { RazerV2Cannon } from "./../objects/garage/cannons/RazerV2.Cannon";
import { RazerQuadroCannon } from "./../objects/garage/cannons/RazerQuadro.Cannon";
import { Mag87Cannon } from "./../objects/garage/cannons/Mag87.Cannon";
import { Mag87sCannon } from "./../objects/garage/cannons/Mag87s.Cannon";
import { Mag87sTurboCannon } from "./../objects/garage/cannons/Mag87sTurbo.Cannon";

const CannonList = {
    'PlasmaG1':         PlasmaG1Cannon,
    'PlasmaG2':         PlasmaG2Cannon,
    'PlasmaDouble':     PlasmaDoubleCannon,
    'PlasmaTripple':    PlasmaTrippleCannon,
    'PlasmaZero':       PlasmaZeroCannon,
    'RazerV1':          RazerV1Cannon,
    'RazerV2':          RazerV2Cannon,
    'RazerQuadro':      RazerQuadroCannon,
    'Mag87':            Mag87Cannon,
    'Mag87s':           Mag87sCannon,
    'Mag87sTurbo':      Mag87sTurboCannon
};

//

const ArmorList = {

};

//

class GarageManagerCore {

    private static instance: GarageManagerCore;

    public tanks: Map<string, TankObject> = new Map();
    public cannons: Map<string, CannonGarage> = new Map();
    public armors: Map<string, ArmorGarage> = new Map();
    public engines: Map<string, EngineGarage> = new Map();

    public tanksConfig: any[];

    //

    public set ( data: any ) : void {

        this.tanksConfig = data.tanks;

        for ( let tankName in data.tanks ) {

            const params = data.tanks[ tankName ];
            const Tank = TanksList[ tankName ] as TankObject;

            Tank.title = params.title;
            Tank.ammoCapacity = params.ammoCapacity;
            Tank.speedCoef = params.speedCoef;
            Tank.cannonCoef = params.cannonCoef;
            Tank.armourCoef = params.armourCoef;

            this.tanks.set( tankName, Tank );

        }

        //

        for ( let cannonName in data.cannons ) {

            const Cannon = CannonList[ cannonName ] as CannonGarage;
            this.cannons.set( cannonName, Cannon );

        }

        //

        for ( let armorName in data.armors ) {

            const Armor = ArmorList[ armorName ] as ArmorGarage;
            this.armors.set( armorName, Armor );

        }

        //

        for ( let engineName in data.engines ) {

            const Engine = ArmorList[ engineName ] as EngineGarage;
            this.engines.set( engineName, Engine );

        }

    };

    public prepareTank ( params: any ) : TankObject {

        // check params is valid or set default

        params.tank = params.tank || 'IS2001';
        const rawTankData = this.tanksConfig[ params.tank ];
        params.tank = ( rawTankData !== undefined ) ? params.tank : 'IS2001';
        params.cannon = params.cannon || rawTankData.default.cannon;
        params.armor = params.armor || rawTankData.default.armor;
        params.engine = params.engine || rawTankData.default.engine;

        //

        const tank = new this.tanks[ params.tank ]();
        tank.cannon = new this.cannons[ params.cannon ]();
        tank.armor = new this.armors[ params.armor ]();
        tank.engine = new this.engines[ params.engine ]();

        //

        return tank;

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
