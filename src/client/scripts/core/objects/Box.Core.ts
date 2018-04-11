/*
 * @author ohmed
 * DatTank Box general class
*/

import { BoxGfx } from "./../../graphics/objects/Box.Gfx";

//

class BoxCore {

    public id: number;
    public position = { x: 0, y: 0, z: 0 };
    public type: string;

    protected gfx: BoxGfx = new BoxGfx();

    //

    public remove () {

        this.gfx.dispose();

    };

    public pick () {

        this.gfx.pick();

    };

    public update ( time: number, delta: number ) {

        this.gfx.update( time, delta );

    };

    public init () {

        this.gfx.init( this );

    };

    constructor ( params ) {

        //

    };

};

// get all boxes and put into 'BoxesList' object

import { HealthBox } from "./../../objects/boxes/Health.Box";
import { AmmoBox } from "./../../objects/boxes/Ammo.Box";

let BoxesList = {
    Health:     HealthBox,
    Ammo:       AmmoBox
};

//

export { BoxCore };
export { BoxesList };
