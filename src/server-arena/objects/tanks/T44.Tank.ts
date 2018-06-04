/*
 * @author ohmed
 * Tank "T44" unit class
*/

import { TankObject } from "./../core/Tank.Object";

//

class T44Tank extends TankObject {

    public origParams: object = {};

    //

    constructor () {

        super();

        //

        this.title = 'T44';
        this.typeId = 2;

        this.armour = 90;
        this.bullet = 85;
        this.speed = 51;
        this.rpm = 10.7 * 10;
        this.ammoCapacity = 64;

        this.origParams = {
            armour:         this.armour,
            bullet:         this.bullet,
            speed:          this.speed,
            rpm:            this.rpm,
            ammoCapacity:   this.ammoCapacity
        };

    };

};

//

export { T44Tank };
