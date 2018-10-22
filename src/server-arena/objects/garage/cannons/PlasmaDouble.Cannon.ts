/*
 * @author ohmed
 * Tank Cannon "Plasma double" class
*/

import { CannonGarage } from './../core/Cannon.Garage';

//

export class PlasmaDoubleCannon extends CannonGarage {

    constructor () {

        super();

        this.rpm = PlasmaDoubleCannon.rmp;
        this.damage = PlasmaDoubleCannon.damage;
        this.overheating = PlasmaDoubleCannon.overheating;

    };

};
