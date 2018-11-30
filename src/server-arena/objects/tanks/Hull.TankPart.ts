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

    public cannonCoef: number;
    public armorCoef: number;
    public speedCoef: number;
    public ammoCapacity: number;

    //

    constructor ( tank: TankObject, params: any, level: number ) {

        this.tank = tank;
        this.nid = params.nid;
        this.title = params.title;

        this.cannonCoef = params.levels[ level ].cannonCoef;
        this.armorCoef = params.levels[ level ].armorCoef;
        this.speedCoef = params.levels[ level ].speedCoef;
        this.ammoCapacity = params.levels[ level ].ammoCapacity;

    };

};
