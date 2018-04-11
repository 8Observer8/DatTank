/*
 * @author ohmed
 * DatTank Box general class
*/

class BoxCore {

    public id: number;
    
    //

    public update ( time: number, delta: number ) {

        // todo

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
