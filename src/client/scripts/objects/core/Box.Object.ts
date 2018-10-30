/*
 * @author ohmed
 * DatTank Box Object class
*/

import * as OMath from '../../OMath/Core.OMath';

import { Arena } from '../../core/Arena.Core';
import { BoxGfx } from '../../graphics/objects/Box.Gfx';
import { BoxManager } from '../../managers/Box.Manager';
import { Logger } from '../../utils/Logger';

//

export class BoxObject {

    public id: number;
    public position: OMath.Vec3 = new OMath.Vec3();
    public type: string;

    protected gfx: BoxGfx = new BoxGfx();

    //

    public remove () : void {

        this.gfx.dispose();

    };

    public pick ( playerId: number ) : void {

        this.gfx.pick();
        BoxManager.remove( [ this.id ] );

        if ( Arena.meId === playerId ) {

            Logger.newEvent( 'BoxPicked', 'game' );

        }

    };

    public update ( time: number, delta: number ) : void {

        this.gfx.update( time, delta );

    };

    public init () : void {

        this.gfx.init( this );

    };

    //

    constructor ( params: any ) {

        this.id = params.id;
        this.position.copy( params.position );

    };

};

// get all boxes and put into 'BoxesList' object

import { HealthBox } from '../../objects/boxes/Health.Box';
import { AmmoBox } from '../../objects/boxes/Ammo.Box';
import { CoinBox } from '../../objects/boxes/Coin.Box';

export const BoxesList = {
    HealthBox,
    AmmoBox,
    CoinBox,
    getById: ( boxId: number ) => {

        for ( const item in BoxesList ) {

            if ( typeof item === 'string' ) {

                if ( BoxesList[ item ].bid === boxId ) {

                    return item;

                }

            }

        }

        return null;

    },
};
