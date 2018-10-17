/*
 * @author ohmed
 * Tank Cannon "Razer quadro" class
*/

import { CannonGarage } from "./../core/Cannon.Garage";

//

export class RazerQuadroCannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = RazerQuadroCannon.rmp;
        this.damage = RazerQuadroCannon.damage;

    };

};
