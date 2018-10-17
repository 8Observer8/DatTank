/*
 * @author ohmed
 * Tank "Orbit T32s" unit class
*/

import { TankObject } from "./../../core/Tank.Object";
import { PlayerCore } from "./../../../core/Player.Core";

//

export class OrbitT32sTank extends TankObject {

    public origParams: object = {};

    //

    constructor ( player: PlayerCore ) {

        super( player );

        //

        this.typeId = 4;

        this.title = OrbitT32sTank.title;
        this.armourCoef = OrbitT32sTank.armorCoef;
        this.cannonCoef = OrbitT32sTank.cannonCoef;
        this.speedCoef = OrbitT32sTank.speedCoef;
        this.ammoCapacity = OrbitT32sTank.ammoCapacity;

        this.origParams = {
            ammoCapacity:   this.ammoCapacity
        };

    };

};
