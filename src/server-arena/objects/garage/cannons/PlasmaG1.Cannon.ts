/*
 * @author ohmed
 * Tank Cannon "Plasma g1" class
*/

import { CannonGarage } from "./../core/Cannon.Garage";

//

export class PlasmaG1Cannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = PlasmaG1Cannon.rmp;
        this.damage = PlasmaG1Cannon.damage;

    };

};
