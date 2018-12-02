/*
 * @author ohmed
 * Tank Hull part
*/

import { TankObject } from '../core/Tank.Object';

//

export class HullTankPart {

    public tank: TankObject;
    public nid: number;
    public title: string;

    public armorCoef: number;
    public speedCoef: number;
    public ammoCapacity: number;

    //

    constructor ( tank: TankObject, params: any ) {

        this.tank = tank;

        this.nid = params.nid;
        this.armorCoef = params.armorCoef;
        this.speedCoef = params.speedCoef;
        this.ammoCapacity = params.ammoCapacity;

    };

};
