/*
 * @author ohmed
 * Box object class
*/

import * as OMath from '../../OMath/Core.OMath';
import { ArenaCore } from '../../core/Arena.Core';
import { PlayerCore } from '../../core/Player.Core';

//

export class BoxObject {

    private static numIds = 0;

    //

    public arena: ArenaCore;
    public id: number;
    public removed: boolean = false;
    public radius: number = 10;
    public position: OMath.Vec3 = new OMath.Vec3();
    public rotation: number = 0;
    public typeId: number;
    public amount: number = 0;

    public readonly type: string = 'Box';

    //

    public dispose ( player: PlayerCore ) : void {

        this.arena.boxManager.remove( this );
        this.arena.removeObjectFromRangeParams( this );
        this.arena.network.boxPicked( this, player );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        if ( BoxObject.numIds > 1000 ) BoxObject.numIds = 0;
        this.id = BoxObject.numIds ++;
        this.arena = arena;

        this.position.copy( params.position );
        this.arena.collisionManager.addObject( this, 'circle', false, true );

    };

};
