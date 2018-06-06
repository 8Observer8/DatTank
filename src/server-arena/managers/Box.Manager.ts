/*
 * @author ohmed
 * DatTank Box manager sys
*/

import * as OMath from "./../OMath/Core.OMath";
import { ArenaCore } from "./../core/Arena.Core";
import { BoxObject } from "./../objects/core/Box.Object";
import { PlayerCore } from "./../core/Player.Core";

import { AmmoBoxObject } from "./../objects/boxes/Ammo.Box";
import { HealthBoxObject } from "./../objects/boxes/Health.Box";

//

class BoxManager {

    private boxNum: number = 25;
    private boxes: Array<BoxObject> = [];
    private arena: ArenaCore;

    //

    public add ( params: any ) {

        let box = null;
        let position = null;

        params.type = params.type || 'Ammo';

        while ( ! position || ! this.arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x, 0, position.z ), 50 ) ) {

            position = new OMath.Vec3( Math.floor( 2000 * ( Math.random() - 0.5 ) ), 20, Math.floor( 2000 * ( Math.random() - 0.5 ) ) );

        }

        //

        const BoxesTypes = {
            'Ammo':     AmmoBoxObject,
            'Health':   HealthBoxObject
        };

        if ( ! BoxesTypes[ params.type ] ) {

            console.log('Unknown Game Box type.');

        } else {

            box = new BoxesTypes[ params.type ]( this.arena, { position: position });

        }

        this.boxes.push( box );

    };

    public remove ( box: BoxObject ) {

        let newBoxList = [];
        box.removed = true;

        for ( let i = 0, il = this.boxes.length; i < il; i ++ ) {

            if ( this.boxes[ i ].id === box.id ) continue;
            newBoxList.push( this.boxes[ i ] );

        }

        this.boxes = newBoxList;

        // this.arena.collisionManager.removeObject( box );

        //

        this.add({ type: ( Math.random() > 0.4 ) ? 'Ammo' : 'Health' });

    };

    public getInRange ( player: PlayerCore ) {

        let dx, dz;
        let range = 40;
        let result = [];

        for ( let i = 0, il = this.boxes.length; i < il; i ++ ) {

            dx = this.boxes[ i ].position.x - player.tank.position.x;
            dz = this.boxes[ i ].position.z - player.tank.position.z;

            if ( Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) < range ) {

                result.push( this.boxes[ i ] );

            }

        }

        return result;

    };

    public getBoxes () {

        return this.boxes;

    };

    public init () {

        for ( let i = 0; i < this.boxNum; i ++ ) {

            this.add({ type: ( Math.random() > 0.4 ) ? 'Ammo' : 'Health' });

        }

    };

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};

//

export { BoxManager };
