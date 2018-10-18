/*
 * @author ohmed
 * DatTank Tank T29
*/

import { TankObject } from '../../objects/core/Tank.Object';

//

export class T29Tank extends TankObject {

    public static title: string = 'T29';
    public static year: number = 1946;
    public static speed: number = 35;
    public static ammoCapacity: number = 126;
    public static bullet: number = 76;
    public static rpm: number = 16.7 * 10;
    public static armour: number = 102;

    public static tid = 1;

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
