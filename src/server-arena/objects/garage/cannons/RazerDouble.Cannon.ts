/*
 * @author ohmed
 * Tank Cannon "Razer double" class
*/

import { CannonGarage } from './../core/Cannon.Garage';

//

export class RazerDoubleCannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = RazerDoubleCannon.rmp;
        this.damage = RazerDoubleCannon.damage;
        this.overheating = RazerDoubleCannon.overheating;

    };

};
