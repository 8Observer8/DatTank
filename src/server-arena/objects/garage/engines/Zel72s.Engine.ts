/*
 * @author ohmed
 * Tank Cannon "ZEL 72s" class
*/

import { EngineGarage } from '../core/Engine.Garage';

//

export class ZEL72sEngine extends EngineGarage {

    constructor () {

        super();

        this.maxSpeed = ZEL72sEngine.maxSpeed;
        this.power = ZEL72sEngine.power;

    };

};
