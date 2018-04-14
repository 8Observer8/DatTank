/*
 * @author ohmed
 * DatTank Tank T44
*/

import { TankCore, TankList } from "./../../core/objects/Tank.Core";

//

class T44Tank extends TankCore {

    static title: string = 'T44';
    static year: number = 1944;
    static speed: number = 51;
    static ammoCapacity: number = 64;
    static bullet: number = 85;
    static rpm: number = 10.7 * 10;
    static armour: number = 90;

    static tid = 2;

    //

    public init () {

        this.title = T44Tank.title;
        this.year = T44Tank.year;
        this.speed = T44Tank.speed;
        this.ammoCapacity = T44Tank.ammoCapacity;
        this.bullet = T44Tank.bullet;
        this.rpm = T44Tank.rpm;
        this.armour = T44Tank.armour;

        //

        this.gfx.init( this.title );

    };

    constructor ( params ) {

        super( params );

    };

};

//

export { T44Tank };
