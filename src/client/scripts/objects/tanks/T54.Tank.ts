/*
 * @author ohmed
 * DatTank Tank T54
*/

import { TankObject } from '../../objects/core/Tank.Object';

//

export class T54Tank extends TankObject {

    public static title: string = 'T54';
    public static year: number = 1946;
    public static speed: number = 48;
    public static ammoCapacity: number = 50;
    public static bullet: number = 100;
    public static rpm: number = 7.06 * 10;
    public static armour: number = 120;

    public static tid = 3;

    //

    constructor ( params: any ) {

        super( params );

        //

        this.title = T54Tank.title;
        this.year = T54Tank.year;
        this.speed = T54Tank.speed;
        this.ammoCapacity = T54Tank.ammoCapacity;
        this.bullet = T54Tank.bullet;
        this.rpm = T54Tank.rpm;
        this.armour = T54Tank.armour;

    };

};
