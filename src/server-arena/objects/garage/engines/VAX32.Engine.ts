/*
 * @author ohmed
 * Tank Cannon "VAX 32" class
*/

import { EngineGarage } from "./../core/Engine.Garage";

//

export class VAX32Engine extends EngineGarage {

    constructor () {

        super();

        this.maxSpeed = VAX32Engine.maxSpeed;
        this.acceleration = VAX32Engine.acceleration;

    };

};
