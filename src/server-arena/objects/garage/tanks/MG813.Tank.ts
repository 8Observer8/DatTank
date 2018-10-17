/*
 * @author ohmed
 * Tank "MG813" unit class
*/

import { TankObject } from "./../../core/Tank.Object";
import { PlayerCore } from "./../../../core/Player.Core";

//

export class MG813Tank extends TankObject {

    public origParams: object = {};

    //

    constructor ( player: PlayerCore ) {

        super( player );

        //

        this.typeId = 3;

        this.title = MG813Tank.title;
        this.armourCoef = MG813Tank.armorCoef;
        this.cannonCoef = MG813Tank.cannonCoef;
        this.speedCoef = MG813Tank.speedCoef;
        this.ammoCapacity = MG813Tank.ammoCapacity;

        this.origParams = {
            ammoCapacity:   this.ammoCapacity
        };

    };

};
