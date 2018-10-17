/*
 * @author ohmed
 * Tank "IS2001" unit class
*/

import { TankObject } from "./../../core/Tank.Object";
import { PlayerCore } from "./../../../core/Player.Core";

//

export class IS2001Tank extends TankObject {

    public origParams: object = {};

    //

    constructor ( player: PlayerCore ) {

        super( player );

        //

        this.typeId = 2;

        this.title = IS2001Tank.title;
        this.armourCoef = IS2001Tank.armorCoef;
        this.cannonCoef = IS2001Tank.cannonCoef;
        this.speedCoef = IS2001Tank.speedCoef;
        this.ammoCapacity = IS2001Tank.ammoCapacity;

        this.origParams = {
            ammoCapacity:   this.ammoCapacity
        };

    };

};
