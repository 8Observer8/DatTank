/*
 * @author ohmed
 * DatTank Tank general class
*/

import { Arena } from "./../Arena.Core";
import { UI } from "./../../ui/Core.UI";
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

        if ( this.health <= 0 ) return;

        this.ammo = value;
        UI.InGame.updateAmmo( this.ammo );

    };

    public setHealth ( value: number, trigger: any ) {

        if ( this.health <= 0 ) return;

        // this.tank.addHealthChangeLabel( health - this.health );

        if ( Arena.me.id === this.id ) {

            if ( value < this.health ) {

                // view.addCameraShake( 300, 3 );

            }

            UI.InGame.updateHealth( value );

        }

        this.health = value;

        // this.tank.updateLabel();

        // if ( this.health === 0 ) {

        //     this.die( killerId );

        // } else if ( this.health <= 50 ) {

        //     this.showSmoke();

        // } else {

        //     this.hideSmoke();

        // }

    };

    private updateMovement ( time: number, delta: number ) {

        //

    };

    public friendlyFire () {

        // todo

    };

    public update ( time: number, delta: number ) {

        if ( this.health <= 0 ) return;

        this.updateMovement( time, delta );

    };

    public dispose () {

        // todo

    };

    public init ( params ) {

        this.position.x = params.position.x;
        this.position.y = params.position.y;
        this.position.z = params.position.z;
        this.gfx.setPosition( this.position );

        this.rotation = params.rotation;
        this.rotationCorrection = 0;
        this.topRotation = params.rotationTop;

    };

    //

    constructor ( params ) {

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
    T54:    T54Tank,
    getById: function ( tankId ) {

        for ( let item in TankList ) {

            if ( typeof item === "string" ) {

                if ( TankList[ item ].tid === tankId ) {

                    return item;

                }

            }

        }

        return null;

    }
};

//

export { TankCore };
export { TankList };
