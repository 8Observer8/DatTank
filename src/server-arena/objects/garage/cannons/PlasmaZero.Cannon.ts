/*
 * @author ohmed
 * Tank Cannon "Plasma zero" class
*/

import { CannonGarage } from "./../core/Cannon.Garage";

//

export class PlasmaZeroCannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = PlasmaZeroCannon.rmp;
        this.damage = PlasmaZeroCannon.damage;

    };

};
