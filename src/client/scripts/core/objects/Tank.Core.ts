/*
 * @author ohmed
 * DatTank Tank general class
*/

import { PlayerCore } from "./../Player.Core";

//

let TankList = {};

//

class TankCore {

    static list: object;

    public id: number;
    public player: PlayerCore;

    public title: string;
    public year: number;
    public speed: number;
    public ammoCapacity: number;
    public bullet: number;
    public rpm: number;
    public armour: number;

};

// get all tanks and put into 'TanksList' object

import { IS2Tank } from "./../../objects/tanks/IS2.Tank";
import { T29Tank } from "./../../objects/tanks/T29.Tank";
import { T44Tank } from "./../../objects/tanks/T44.Tank";
import { T54Tank } from "./../../objects/tanks/T54.Tank";

TankList['IS2'] = IS2Tank;
TankList['T29'] = T29Tank;
TankList['T44'] = T44Tank;
TankList['T54'] = T54Tank;

//

export { TankCore };
export { TankList };
