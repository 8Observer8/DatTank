/*
 * @author ohmed
 * DatTank Box manager sys
*/

import * as OMath from '../OMath/Core.OMath';
import { ArenaCore } from '../core/Arena.Core';
import { BoxObject } from '../objects/core/Box.Object';
import { PlayerCore } from '../core/Player.Core';

import { AmmoBoxObject } from '../objects/boxes/Ammo.Box';
import { HealthBoxObject } from '../objects/boxes/Health.Box';
import { CoinBoxObject } from '../objects/boxes/Coin.Box';

//

export class BoxManager {

    private boxNum: number = 20;
    private boxes: BoxObject[] = [];
    private arena: ArenaCore;

    //

    public add ( params: any ) : void {

        let box = null;
        let position = params.position || null;

        params.type = params.type || 'Ammo';

        while ( ! position || ! this.arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x, 10, position.z ), 30 ) ) {

            position = new OMath.Vec3( Math.floor( 2000 * ( Math.random() - 0.5 ) ), 20, Math.floor( 2000 * ( Math.random() - 0.5 ) ) );

        }

        //

        const BoxesTypes = {
            Ammo:       AmmoBoxObject,
            Health:     HealthBoxObject,
            Coin:       CoinBoxObject,
        };

        if ( ! BoxesTypes[ params.type ] ) {

            console.log('Unknown Game Box type.');

        } else {

            box = new BoxesTypes[ params.type ]( this.arena, { position });

        }

        this.boxes.push( box );

    };

    public remove ( box: BoxObject ) : void {

        if ( box.removed ) return;

        const newBoxList = [];
        box.removed = true;
        this.arena.collisionManager.removeObject( box );

        for ( let i = 0, il = this.boxes.length; i < il; i ++ ) {

            if ( this.boxes[ i ].id === box.id ) continue;
            newBoxList.push( this.boxes[ i ] );

        }

        this.boxes = newBoxList;

        //

        this.add({ type: this.getRandomBoxType() });

    };

    public getInRange ( player: PlayerCore ) : BoxObject[] {

        let dx;
        let dz;
        const range = 40;
        const result = [];

        for ( let i = 0, il = this.boxes.length; i < il; i ++ ) {

            dx = this.boxes[ i ].position.x - player.tank.position.x;
            dz = this.boxes[ i ].position.z - player.tank.position.z;

            if ( Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) < range ) {

                result.push( this.boxes[ i ] );

            }

        }

        return result;

    };

    public getBoxes () : BoxObject[] {

        return this.boxes;

    };

    private getRandomBoxType () : string {

        const boxTypeRnd = Math.random();

        if ( boxTypeRnd < 0.4 ) {

            return 'Coin';

        } else if ( boxTypeRnd < 0.7 ) {

            return 'Ammo';

        } else if ( boxTypeRnd < 1 ) {

            return 'Health';

        }

        return 'Ammo';

    };

    public init () : void {

        for ( let i = 0; i < this.boxNum; i ++ ) {

            this.add({ type: this.getRandomBoxType() });

        }

    };

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};
