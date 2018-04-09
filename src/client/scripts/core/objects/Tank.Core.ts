/*
 * @author ohmed
 * DatTank Tank general class
*/

import { PlayerCore } from "./../Player.Core";

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

//

export { TankCore };
export const TankList = {};
