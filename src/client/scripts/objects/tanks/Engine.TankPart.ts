/*
 * @author ohmed
 * Tank Engine part
*/

import { TankObject } from '../core/Tank.Object';

//

export class EngineTankPart {

    public tank: TankObject;
    public nid: number;
    public maxSpeed: number;
    public power: number;

    //

    constructor ( tank: TankObject, params: any ) {

        this.tank = tank;

        this.nid = params.nid;
        this.maxSpeed = params.maxSpeed;
        this.power = params.power;

    };

};
