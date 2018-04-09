/*
 * @author ohmed
 * DatTank Tank T54 file
*/

import { TankCore, TankList } from "./../../core/objects/Tank.Core";

//

class T54Tank extends TankCore {

    static title: string = 'T54';
    static year: number = 1946;
    static speed: number = 48;
    static ammoCapacity: number = 50;
    static bullet: number = 100;
    static rpm: number = 7.06 * 10;
    static armour: number = 120;

    //

    public init () {

        this.title = T54Tank.title;
        this.year = T54Tank.year;
        this.speed = T54Tank.speed;
        this.ammoCapacity = T54Tank.ammoCapacity;
        this.bullet = T54Tank.bullet;
        this.rpm = T54Tank.rpm;
        this.armour = T54Tank.armour;

        // todo

    };

};

TankList['T54'] = T54Tank;

//

export { T54Tank };
