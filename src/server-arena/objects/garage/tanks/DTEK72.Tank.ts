/*
 * @author ohmed
 * Tank "DTEK 72" unit class
*/

import { TankObject } from "./../../core/Tank.Object";
import { PlayerCore } from "./../../../core/Player.Core";

//

export class DTEK72sTank extends TankObject {

    public origParams: object = {};

    //

    constructor ( player: PlayerCore ) {

        super( player );

        //

        this.typeId = 1;

        this.title = DTEK72sTank.title;
        this.armourCoef = DTEK72sTank.armorCoef;
        this.cannonCoef = DTEK72sTank.cannonCoef;
        this.speedCoef = DTEK72sTank.speedCoef;
        this.ammoCapacity = DTEK72sTank.ammoCapacity;

        this.origParams = {
            ammoCapacity:   this.ammoCapacity
        };

    };

};
