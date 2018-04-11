/*
 * @author ohmed
 * DatTank Tank general class
*/

import { PlayerCore } from "./../Player.Core";

import { TankNetwork } from "./../../network/Tank.Network";
import { TankGfx } from "./../../graphics/objects/Tank.Gfx";

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

    public health: number;
    public ammo: number;

    public topRotation: number = 0;
    public moveDirection = { x: 0, y: 0, z: 0 };
    public positionCorrection = { x: 0, y: 0, z: 0 };
    public rotationCorrection: number = 0;

    public position = { x: 0, y: 0, z: 0 };
    public rotation: number = 0;

    protected network: TankNetwork = new TankNetwork();
    protected gfx: TankGfx = new TankGfx();

    //

    public shoot ( id: number ) {

        // todo

    };

    public setMovement ( directionX: number, directionZ: number, positionX: number, positionZ: number, rotation: number ) {

        this.moveDirection.x = directionX;
        this.moveDirection.y = directionZ;
    
        this.positionCorrection.x = positionX - this.position.x;
        this.positionCorrection.y = 0;
        this.positionCorrection.z = positionZ - this.position.z;

        this.rotationCorrection = rotation / 1000.0 - this.rotation;

    };

    public setTopRotation ( angle: number ) {

        this.topRotation = angle;
        this.gfx.setTopRotation( angle );

    };

    public setAmmo ( value: number ) {

        // todo

    };

    public setHealth ( value: number, trigger: any ) {

        // todo

    };

    private updateMovement ( time: number, delta: number ) {

        // todo

    };

    public friendlyFire () {

        // todo

    };

    public update ( time: number, delta: number ) {

        this.updateMovement( time, delta );

    };

    public dispose () {

        // todo

    };

    public init ( params ) {

        // todo

    };

    //

    constructor ( arena, params ) {

        this.init( params );

    };

};

// get all tanks and put into 'TanksList' object

import { IS2Tank } from "./../../objects/tanks/IS2.Tank";
import { T29Tank } from "./../../objects/tanks/T29.Tank";
import { T44Tank } from "./../../objects/tanks/T44.Tank";
import { T54Tank } from "./../../objects/tanks/T54.Tank";

let TankList = {
    IS2:    IS2Tank,
    T29:    T29Tank,
    T44:    T44Tank,
    T54:    T54Tank
};

//

export { TankCore };
export { TankList };
