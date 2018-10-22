/*
 * @author ohmed
 * Tank Cannon "Razer v1" class
*/

import { CannonGarage } from './../core/Cannon.Garage';

//

export class RazerV1Cannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = RazerV1Cannon.rmp;
        this.damage = RazerV1Cannon.damage;
        this.overheating = RazerV1Cannon.overheating;

    };

};
