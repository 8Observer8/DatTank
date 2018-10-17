/*
 * @author ohmed
 * Tank Cannon "KTZ r2" class
*/

import { EngineGarage } from "./../core/Engine.Garage";

//

export class KTZr2Engine extends EngineGarage {

    constructor () {

        super();

        this.maxSpeed = KTZr2Engine.maxSpeed;
        this.power = KTZr2Engine.power;

    };

};
