/*
 * @author ohmed
 * Tank "T29" unit class
*/

import { TankObject } from "./../core/Tank.Object";
import { PlayerCore } from "./../../core/Player.Core";

//

class T29Tank extends TankObject {

    public origParams: object = {};

    //

    constructor ( player: PlayerCore ) {

        super( player );

        //

        this.title = 'T29';
        this.typeId = 1;

        this.armour = 102;
        this.bullet = 76;
        this.speed = 35;
        this.rpm = 16.67 * 10;
        this.ammoCapacity = 127;

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

export { T29Tank };
