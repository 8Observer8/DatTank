/*
 * @author ohmed
 * DatTank Tank IS2 file
*/

import { TankCore, TankList } from "./../../core/objects/Tank.Core";

//

class IS2Tank extends TankCore {

    static title: string = 'IS2';
    static year: number = 1950;
    static speed: number = 37;
    static ammoCapacity: number = 36;
    static bullet: number = 122;
    static rpm: number = 4.88 * 10;
    static armour: number = 90;

    //

    public init () {

        this.title = IS2Tank.title;
        this.year = IS2Tank.year;
        this.speed = IS2Tank.speed;
        this.ammoCapacity = IS2Tank.ammoCapacity;
        this.bullet = IS2Tank.bullet;
        this.rpm = IS2Tank.rpm;
        this.armour = IS2Tank.armour;

        //

        this.gfx.init( this.title );

    };

};

TankList['IS2'] = IS2Tank;

//

export { IS2Tank };
