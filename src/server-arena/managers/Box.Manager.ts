/*
 * @author ohmed
 * DatTank Box manager sys
*/

import { ArenaCore } from "./../core/Arena.Core";
import { BoxCore } from "./../objects/core/Box.Object";
import { PlayerCore } from "../core/Player.Core";

//

class BoxManager {

    private boxNum: number = 25;
    private boxes: Array<BoxCore> = [];
    private arena: ArenaCore;

    //

    public add ( params: any ) {

        // todo

    };

    public remove ( box: BoxCore ) {

        // todo

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

    public init () {

        for ( var i = 0; i < this.boxNum; i ++ ) {

            this.add({ type: ( Math.random() > 0.4 ) ? 'Ammo' : 'Health' });
    
        }

    };

    constructor ( arena: ArenaCore ) {

        this.arena = arena;

    };

};

//

export { BoxManager };
