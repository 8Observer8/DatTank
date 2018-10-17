/*
 * @author ohmed
 * Tank Cannon "ZEL 72" class
*/

import { EngineGarage } from "./../core/Engine.Garage";

//

export class ZEL72Engine extends EngineGarage {

    constructor () {

        super();

        this.maxSpeed = ZEL72Engine.maxSpeed;
        this.acceleration = ZEL72Engine.acceleration;

    };

};
