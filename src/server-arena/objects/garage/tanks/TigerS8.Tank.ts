/*
 * @author ohmed
 * Tank "Tiger S8" unit class
*/

import { TankObject } from "./../../core/Tank.Object";
import { PlayerCore } from "./../../../core/Player.Core";

//

export class TigerS8Tank extends TankObject {

    public origParams: object = {};

    //

    constructor ( player: PlayerCore ) {

        super( player );

        //

        this.typeId = 6;

        this.title = TigerS8Tank.title;
        this.armourCoef = TigerS8Tank.armorCoef;
        this.cannonCoef = TigerS8Tank.cannonCoef;
        this.speedCoef = TigerS8Tank.speedCoef;
        this.ammoCapacity = TigerS8Tank.ammoCapacity;

        this.origParams = {
            ammoCapacity:   this.ammoCapacity
        };

    };

};
