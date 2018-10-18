/*
 * @author ohmed
 * DatTank Tank T44
*/

import { TankObject } from '../../objects/core/Tank.Object';

//

export class T44Tank extends TankObject {

    public static title: string = 'T44';
    public static year: number = 1944;
    public static speed: number = 51;
    public static ammoCapacity: number = 64;
    public static bullet: number = 85;
    public static rpm: number = 10.7 * 10;
    public static armour: number = 90;

    public static tid = 2;

    //

    constructor ( params: any ) {

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
