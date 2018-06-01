/*
 * @author ohmed
 * Decoration object class
*/

import * as OMath from "./../../OMath/Core.OMath";
import { ArenaCore } from "./../../core/Arena.Core";

//

class DecorationCore {

    private static numId: number = 1;

    public id: number;
    public arena: ArenaCore;
    public name: string;
    public collisionBox: any;

    public rotation: number = 0;
    public scale: OMath.Vec3 = new OMath.Vec3();
    public position: OMath.Vec3 = new OMath.Vec3();

    //

    public toJSON () {

        // todo

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        this.arena = arena;

        if ( DecorationCore.numId > 1000 ) DecorationCore.numId = 0;
        this.id = DecorationCore.numId ++;

        this.rotation = params.rotation || 0;
        this.position.set( params.position.x, params.position.y, params.position.z );
        this.scale.set( params.scale.x, params.scale.y, params.scale.z );
        this.name = params.name || '';

    };

};

//

export { DecorationCore };
