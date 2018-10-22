/*
 * @author ohmed
 * DatTank Garage manager sys
*/

import { PlayerCore } from '../core/Player.Core';
import { TankObject } from '../objects/core/Tank.Object';
import { ArmorGarage } from '../objects/garage/core/Armor.Garage';
import { CannonGarage } from '../objects/garage/core/Cannon.Garage';
import { EngineGarage } from '../objects/garage/core/Engine.Garage';

//

import { DTEK72Tank } from '../objects/garage/tanks/DTEK72.Tank';
import { IS2001Tank } from '../objects/garage/tanks/IS2001.Tank';
import { MG813Tank } from '../objects/garage/tanks/MG813.Tank';
import { OrbitT32sTank } from '../objects/garage/tanks/OrbitT32s.Tank';
import { RiperX3Tank } from '../objects/garage/tanks/RiperX3.Tank';
import { TigerS8Tank } from '../objects/garage/tanks/TigerS8.Tank';

const TanksList = {
    DTEK72:       DTEK72Tank,
    IS2001:       IS2001Tank,
    MG813:        MG813Tank,
    OrbitT32s:    OrbitT32sTank,
    RiperX3:      RiperX3Tank,
    TigerS8:      TigerS8Tank,
};

//

import { PlasmaG1Cannon } from '../objects/garage/cannons/PlasmaG1.Cannon';
import { PlasmaG2Cannon } from '../objects/garage/cannons/PlasmaG2.Cannon';
import { PlasmaDoubleCannon } from '../objects/garage/cannons/PlasmaDouble.Cannon';
import { PlasmaTripleCannon } from '../objects/garage/cannons/PlasmaTriple.Cannon';
import { PlasmaZeroCannon } from '../objects/garage/cannons/PlasmaZero.Cannon';
import { RazerV1Cannon } from '../objects/garage/cannons/RazerV1.Cannon';
import { RazerV2Cannon } from '../objects/garage/cannons/RazerV2.Cannon';
import { RazerDoubleCannon } from '../objects/garage/cannons/RazerDouble.Cannon';
import { RazerQuadroCannon } from '../objects/garage/cannons/RazerQuadro.Cannon';
import { Mag87Cannon } from '../objects/garage/cannons/Mag87.Cannon';
import { Mag87sCannon } from '../objects/garage/cannons/Mag87s.Cannon';
import { Mag87sTurboCannon } from '../objects/garage/cannons/Mag87sTurbo.Cannon';

const CannonList = {
    'Plasma-g1':         PlasmaG1Cannon,
    'Plasma-g2':         PlasmaG2Cannon,
    'Plasma-double':     PlasmaDoubleCannon,
    'Plasma-triple':     PlasmaTripleCannon,
    'Plasma-zero':       PlasmaZeroCannon,
    'Razer-v1':          RazerV1Cannon,
    'Razer-v2':          RazerV2Cannon,
    'Razer-double':      RazerDoubleCannon,
    'Razer-quadro':      RazerQuadroCannon,
    'Mag87':             Mag87Cannon,
    'Mag87s':            Mag87sCannon,
    'Mag87s-turbo':      Mag87sTurboCannon,
};

//

import { KS200ShieldArmor } from '../objects/garage/armors/KS200Shield.Armor';
import { KSShieldArmor } from '../objects/garage/armors/KSShield.Armor';
import { MGDefenceArmor } from '../objects/garage/armors/MGDefence.Armor';
import { MGDefenceV2Armor } from '../objects/garage/armors/MGDefenceV2.Armor';
import { P12ShieldArmor } from '../objects/garage/armors/P12Shield.Armor';
import { P125ShieldArmor } from '../objects/garage/armors/P125Shield.Armor';
import { XShieldArmor } from '../objects/garage/armors/XShield.Armor';
import { Z8ShieldArmor } from '../objects/garage/armors/Z8Shield.Armor';
import { T215ArmorArmor } from '../objects/garage/armors/T215Armor.Armor';

const ArmorList = {
    'KS200-shield':      KS200ShieldArmor,
    'KS-shield':         KSShieldArmor,
    'MG-defence':       MGDefenceArmor,
    'MG-defence-v2':    MGDefenceV2Armor,
    'P12-shield':        P12ShieldArmor,
    'P12.5-shield':      P125ShieldArmor,
    'X-shield':          XShieldArmor,
    'Z8-shield':         Z8ShieldArmor,
    'T215-armor':        T215ArmorArmor,
};

//

import { KTZr1Engine } from '../objects/garage/engines/KTZr1.Engine';
import { KTZr2Engine } from '../objects/garage/engines/KTZr2.Engine';
import { KXv8Engine } from '../objects/garage/engines/KXv8.Engine';
import { VAX32Engine } from '../objects/garage/engines/VAX32.Engine';
import { VAX32sEngine } from '../objects/garage/engines/VAX32s.Engine';
import { VAX32v2Engine } from '../objects/garage/engines/VAX32v2.Engine';
import { ZEL72Engine } from '../objects/garage/engines/Zel72.Engine';
import { ZEL72sEngine } from '../objects/garage/engines/Zel72s.Engine';

const EnginesList = {
    'KTZ-r1':       KTZr1Engine,
    'KTZ-r2':       KTZr2Engine,
    'KX-v8':        KXv8Engine,
    'VAX-32':        VAX32Engine,
    'VAX-32s':       VAX32sEngine,
    'VAX-32v2':      VAX32v2Engine,
    'ZEL-72':        ZEL72Engine,
    'ZEL-72s':       ZEL72sEngine,
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

        for ( const tankName in data.tanks ) {

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

        for ( const cannonName in data.cannons ) {

            const params = data.cannons[ cannonName ];
            const Cannon = CannonList[ cannonName ] as CannonGarage;
            Cannon.damage = params.damage;
            Cannon.rpm = params.rpm;
            this.cannons.set( cannonName, Cannon );

        }

        //

        for ( const armorName in data.armors ) {

            const params = data.armors[ armorName ];
            const Armor = ArmorList[ armorName ] as ArmorGarage;
            Armor.armor = params.armor;
            this.armors.set( armorName, Armor );

        }

        //

        for ( const engineName in data.engines ) {

            const params = data.engines[ engineName ];
            const Engine = EnginesList[ engineName ] as EngineGarage;
            Engine.maxSpeed = params.maxSpeed;
            Engine.power = params.power;
            this.engines.set( engineName, Engine );

        }

    };

    public prepareTank ( params: any, player: PlayerCore ) : TankObject {

        // check params is valid or set default

        params = params || {};
        params.tank = ( this.tanksConfig[ params.tank ] !== undefined ) ? params.tank : 'IS2001';
        const rawTankData = this.tanksConfig[ params.tank ];
        params.cannon = params.cannon || rawTankData.default.cannon;
        params.armor = params.armor || rawTankData.default.armor;
        params.engine = params.engine || rawTankData.default.engine;

        //

        const Tank = this.tanks.get( params.tank ) as any;
        const Cannon = this.cannons.get( params.cannon ) as any;
        const Armor = this.armors.get( params.armor ) as any;
        const Engine = this.engines.get( params.engine ) as any;

        const tank = new Tank( player );
        tank.cannon = new Cannon();
        tank.armor = new Armor();
        tank.engine = new Engine();

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