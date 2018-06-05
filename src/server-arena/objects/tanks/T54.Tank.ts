/*
 * @author ohmed
 * Tank "T54" unit class
*/

import { TankObject } from "./../core/Tank.Object";
import { PlayerCore } from "./../../core/Player.Core";

//

class T54Tank extends TankObject {

    public origParams: object = {};

    //

    constructor ( player: PlayerCore ) {

        super( player );

        //

        this.title = 'T54';
        this.typeId = 3;

        this.armour = 120;
        this.bullet = 100;
        this.speed = 48;
        this.rpm = 7.06 * 10;
        this.ammoCapacity = 50;

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

export { T54Tank };
