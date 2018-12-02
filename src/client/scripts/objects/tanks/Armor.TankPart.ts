/*
 * @author ohmed
 * Tank Armor part
*/

import { TankObject } from '../core/Tank.Object';

//

export class ArmorTankPart {

    public tank: TankObject;
    public nid: number;
    public armor: number;

    //

    constructor ( tank: TankObject, params: any ) {

        this.tank = tank;

        this.nid = params.nid;
        this.armor = params.armor;

    };

};
