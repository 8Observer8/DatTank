/*
 * @author ohmed
 * Tank "DTEK 72" unit class
*/

import { TankObject } from "./../../core/Tank.Object";
import { PlayerCore } from "./../../../core/Player.Core";

//

export class DTEK72Tank extends TankObject {

    public origParams: object = {};

    //

    constructor ( player: PlayerCore ) {

        super( player );

        //

        this.typeId = 1;

        this.title = DTEK72Tank.title;
        this.armourCoef = DTEK72Tank.armorCoef;
        this.cannonCoef = DTEK72Tank.cannonCoef;
        this.speedCoef = DTEK72Tank.speedCoef;
        this.ammoCapacity = DTEK72Tank.ammoCapacity;

        this.origParams = {
            ammoCapacity:   this.ammoCapacity
        };

    };

};
