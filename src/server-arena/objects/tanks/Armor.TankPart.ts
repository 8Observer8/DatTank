/*
 * @author ohmed
 * Tank Armor part
*/

import { TankObject } from '../core/Tank.Object';

//

export class ArmorTankPart {

    public tank: TankObject;
    public nid: number;
    public title: string;

    public armor: number;

    //

    constructor ( tank: TankObject, params: any, level: number ) {

        this.tank = tank;
        this.nid = params.nid;
        this.title = params.title;

        this.armor = params.levels[ level ].armor;

    };

};
