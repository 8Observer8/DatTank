/*
 * @author ohmed
 * Tank "IS2" unit class
*/

import { TankObject } from "./../core/Tank.Object";

//

class IS2Tank extends TankObject {

    public origParams: object = {};

    //

    constructor () {

        super();

        //

        this.title = 'IS2';
        this.typeId = 0;

        this.armour = 90;
        this.bullet = 122;
        this.speed = 37;
        this.rpm = 4.88 * 10;
        this.ammoCapacity = 36;

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

export { IS2Tank };
