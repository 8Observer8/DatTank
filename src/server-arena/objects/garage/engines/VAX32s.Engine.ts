/*
 * @author ohmed
 * Tank Cannon "VAX 32s" class
*/

import { EngineGarage } from "./../core/Engine.Garage";

//

export class VAX32sEngine extends EngineGarage {

    constructor () {

        super();

        this.maxSpeed = VAX32sEngine.maxSpeed;
        this.power = VAX32sEngine.power;

    };

};
