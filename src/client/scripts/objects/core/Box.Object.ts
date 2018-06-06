/*
 * @author ohmed
 * DatTank Box Object class
*/

import { BoxGfx } from "./../../graphics/objects/Box.Gfx";
import { BoxManager } from "./../../managers/Box.Manager";
import { Logger } from "./../../utils/Logger";
import * as OMath from "./../../OMath/Core.OMath";

//

class BoxObject {

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
        BoxManager.remove( [ this.id ] );
        Logger.newEvent( 'BoxPicked', 'game' );

    };

    public update ( time: number, delta: number ) {

        this.gfx.update( time, delta );

    };

    public init () {

        this.gfx.init( this );

    };

    //

    constructor ( params ) {

        this.id = params.id;
        this.position.copy( params.position );

    };

};

// get all boxes and put into 'BoxesList' object

import { HealthBox } from "./../../objects/boxes/Health.Box";
import { AmmoBox } from "./../../objects/boxes/Ammo.Box";

let BoxesList = {
    HealthBox:  HealthBox,
    AmmoBox:    AmmoBox,
    getById: function ( boxId ) {

        for ( let item in BoxesList ) {

            if ( typeof item === "string" ) {

                if ( BoxesList[ item ].bid === boxId ) {

                    return item;

                }

            }

        }

        return null;

    }
};

//

export { BoxObject };
export { BoxesList };
