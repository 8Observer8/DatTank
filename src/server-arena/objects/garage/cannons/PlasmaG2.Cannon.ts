/*
 * @author ohmed
 * Tank Cannon "Plasma g2" class
*/

import { CannonGarage } from "./../core/Cannon.Garage";

//

export class PlasmaG2Cannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = PlasmaG2Cannon.rmp;
        this.damage = PlasmaG2Cannon.damage;

    };

};
