/*
 * @author ohmed
 * Tank Cannon "Mag 87" class
*/

import { CannonGarage } from './../core/Cannon.Garage';

//

export class Mag87Cannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = Mag87Cannon.rmp;
        this.damage = Mag87Cannon.damage;
        this.overheating = Mag87Cannon.overheating;

    };

};
