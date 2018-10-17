/*
 * @author ohmed
 * DatTank Tank T29
*/

import { TankObject } from "./../../objects/core/Tank.Object";

//

class T29Tank extends TankObject {

    static title: string = 'T29';
    static year: number = 1946;
    static speed: number = 35;
    static ammoCapacity: number = 126;
    static bullet: number = 76;
    static rpm: number = 16.7 * 10;
    static armour: number = 102;

    static tid = 1;

    //

    constructor ( params: any ) {

        super( params );

        //

        this.title = T29Tank.title;
        this.year = T29Tank.year;
        this.speed = T29Tank.speed;
        this.ammoCapacity = T29Tank.ammoCapacity;
        this.bullet = T29Tank.bullet;
        this.rpm = T29Tank.rpm;
        this.armour = T29Tank.armour;

    };

};

//

export { T29Tank };
