/*
 * @author ohmed
 * DatTank Tank IS2
*/

import { TankObject } from '../../objects/core/Tank.Object';

//

export class IS2Tank extends TankObject {

    public static title: string = 'IS2';
    public static year: number = 1950;
    public static speed: number = 37;
    public static ammoCapacity: number = 36;
    public static bullet: number = 122;
    public static rpm: number = 4.88 * 10;
    public static armour: number = 90;

    public static tid = 0;

    //

    constructor ( params: any ) {

        super( params );

        //

        this.title = IS2Tank.title;
        this.year = IS2Tank.year;
        this.speed = IS2Tank.speed;
        this.ammoCapacity = IS2Tank.ammoCapacity;
        this.bullet = IS2Tank.bullet;
        this.rpm = IS2Tank.rpm;
        this.armour = IS2Tank.armour;

    };

};
