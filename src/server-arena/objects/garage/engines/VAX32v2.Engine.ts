/*
 * @author ohmed
 * Tank Cannon "VAX 32 v2" class
*/

import { EngineGarage } from "./../core/Engine.Garage";

//

export class VAX32v2Engine extends EngineGarage {

    constructor () {

        super();

        this.maxSpeed = VAX32v2Engine.maxSpeed;
        this.acceleration = VAX32v2Engine.acceleration;

    };

};
