/*
 * @author ohmed
 * Tank Cannon "KX v8" class
*/

import { EngineGarage } from "./../core/Engine.Garage";

//

export class KXv8Engine extends EngineGarage {

    constructor () {

        super();

        this.maxSpeed = KXv8Engine.maxSpeed;
        this.acceleration = KXv8Engine.acceleration;

    };

};
