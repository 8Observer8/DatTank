/*
 * @author ohmed
 * DatTank Tank T44
*/

import { TankObject } from "./../../objects/core/Tank.Object";

//

class T44Tank extends TankObject {

    static title: string = 'T44';
    static year: number = 1944;
    static speed: number = 51;
    static ammoCapacity: number = 64;
    static bullet: number = 85;
    static rpm: number = 10.7 * 10;
    static armour: number = 90;

    static tid = 2;

    //

    constructor ( params ) {

        super( params );

        //

        this.title = T44Tank.title;
        this.year = T44Tank.year;
        this.speed = T44Tank.speed;
        this.ammoCapacity = T44Tank.ammoCapacity;
        this.bullet = T44Tank.bullet;
        this.rpm = T44Tank.rpm;
        this.armour = T44Tank.armour;

    };

};

//

export { T44Tank };
