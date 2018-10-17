/*
 * @author ohmed
 * Tank "Riper X3" unit class
*/

import { TankObject } from "./../../core/Tank.Object";
import { PlayerCore } from "./../../../core/Player.Core";

//

export class RiperX3Tank extends TankObject {

    public origParams: object = {};

    //

    constructor ( player: PlayerCore ) {

        super( player );

        //

        this.typeId = 5;

        this.title = RiperX3Tank.title;
        this.armourCoef = RiperX3Tank.armorCoef;
        this.cannonCoef = RiperX3Tank.cannonCoef;
        this.speedCoef = RiperX3Tank.speedCoef;
        this.ammoCapacity = RiperX3Tank.ammoCapacity;

        this.origParams = {
            ammoCapacity:   this.ammoCapacity
        };

    };

};
