/*
 * @author ohmed
 * Tank Cannon "Mag 87s turbo" class
*/

import { CannonGarage } from "./../core/Cannon.Garage";

//

export class Mag87sTurboCannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = Mag87sTurboCannon.rmp;
        this.damage = Mag87sTurboCannon.damage;

    };

};
