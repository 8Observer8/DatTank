/*
 * @author ohmed
 * Box object class
*/

import * as OMath from "./../../OMath/Core.OMath";
import { ArenaCore } from "./../../core/Arena.Core";

//

class BoxCore {

    private static numIds = 0;
    private static Types = {
        'Ammo':     0,
        'Health':   1
    };

    public id: number;
    public removed: boolean = false;
    public radius: number = 10;
    public position: OMath.Vec3 = new OMath.Vec3();
    public type: string = 'Box';
    public amount: number = 0;

    protected arena: ArenaCore;

    //

    init () {

        // this.arena.collisionManager.addObject( this, 'circle' );

    };

    dispose () {

        // this.networkBuffers['RemoveBox'] = this.networkBuffers['RemoveBox'] || {};
        // var buffer = this.networkBuffers['RemoveBox'].buffer || new ArrayBuffer( 4 );
        // var bufferView = this.networkBuffers['RemoveBox'].bufferView || new Uint16Array( buffer );
        // this.networkBuffers['RemoveBox'].buffer = buffer;
        // this.networkBuffers['RemoveBox'].bufferView = bufferView;
    
        // bufferView[1] = this.id;
    
        // //
    
        // this.arena.sendEventToPlayersInRange( this.position, 'ArenaBoxRemove', buffer, bufferView );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        if ( BoxCore.numIds > 1000 ) BoxCore.numIds = 0;
        this.id = BoxCore.numIds ++;
        this.arena = arena;

        this.position.copy( params.position );

    };

};

//

export { BoxCore };
