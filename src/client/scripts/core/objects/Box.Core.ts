/*
 * @author ohmed
 * DatTank Box general class
*/

import { BoxGfx } from "./../../graphics/objects/Box.Gfx";
import * as OMath from "./../../OMath/Core.OMath";

//

class BoxCore {

    public id: number;
    public position: OMath.Vec3 = new OMath.Vec3();
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
