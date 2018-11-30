/*
 * @author ohmed
 * Tank Engine part
*/

import { TankObject } from '../core/Tank.Object';

//

export class EngineTankPart {

    public tank: TankObject;
    public nid: number;
    public title: string;

    public maxSpeed: number;
    public power: number;

    //

    constructor ( tank: TankObject, params: any, level: number ) {

        this.tank = tank;
        this.nid = params.nid;
        this.title = params.title;

        this.maxSpeed = params.levels[ level ].maxSpeed;
        this.power = params.levels[ level ].power;

    };

};
