/*
 * @author ohmed
 * Tank Cannon "Mag 87s" class
*/

import { CannonGarage } from './../core/Cannon.Garage';

//

export class Mag87sCannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = Mag87sCannon.rmp;
        this.damage = Mag87sCannon.damage;
        this.overheating = Mag87sCannon.overheating;

    };

};
