/*
 * @author ohmed
 * Tank Cannon "KTZ r1" class
*/

import { EngineGarage } from "./../core/Engine.Garage";

//

export class KTZr1Engine extends EngineGarage {

    constructor () {

        super();

        this.maxSpeed = KTZr1Engine.maxSpeed;
        this.power = KTZr1Engine.power;

    };

};
