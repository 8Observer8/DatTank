/*
 * @author ohmed
 * Tank Cannon "Plasma tripple" class
*/

import { CannonGarage } from "./../core/Cannon.Garage";

//

export class PlasmaTrippleCannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = PlasmaTrippleCannon.rmp;
        this.damage = PlasmaTrippleCannon.damage;

    };

};
