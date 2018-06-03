/*
 * @author ohmed
 * Tank Object class
*/

import * as OMath from "./../../OMath/Core.OMath";
import { PlayerCore } from "./../../core/Player.Core";

//

class TankObject {

    public id: number;
    public position: OMath.Vec3 = new OMath.Vec3();
    public health: number = 100;

    public armour: number;
    public bullet: number;
    public speed: number;
    public rpm: number;

    public player: PlayerCore;

    //

    public friendlyFire () {

        // todo

    };

    public hit ( triggerId: number ) {

        // todo

    };

};

//

export { TankObject };
