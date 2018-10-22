/*
 * @author ohmed
 * Tank Cannon "Razer v2" class
*/

import { CannonGarage } from './../core/Cannon.Garage';

//

export class RazerV2Cannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = RazerV2Cannon.rmp;
        this.damage = RazerV2Cannon.damage;
        this.overheating = RazerV2Cannon.overheating;

    };

};
