/*
 * @author ohmed
 * Tank Cannon "Plasma triple" class
*/

import { CannonGarage } from '../core/Cannon.Garage';

//

export class PlasmaTripleCannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = PlasmaTripleCannon.rmp;
        this.damage = PlasmaTripleCannon.damage;
        this.overheating = PlasmaTripleCannon.overheating;

    };

};
