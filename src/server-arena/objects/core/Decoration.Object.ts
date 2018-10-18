/*
 * @author ohmed
 * Decoration object class
*/

import * as OMath from '../../OMath/Core.OMath';
import { ArenaCore } from '../../core/Arena.Core';

//

export class DecorationObject {

    private static numId: number = 1;

    public id: number;
    public arena: ArenaCore;
    public collisionBox: any;
    public type: string = '';

    public rotation: number = 0;
    public radius: number;
    public scale: OMath.Vec3 = new OMath.Vec3();
    public position: OMath.Vec3 = new OMath.Vec3();
    public size: OMath.Vec3 = new OMath.Vec3();

    //

    public toJSON () : any {

        return {
            id:         this.id,
            type:       this.type,
            position:   this.position.toJSON(),
            rotation:   this.rotation,
            scale:      this.scale.toJSON(),
        };

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        this.arena = arena;

        if ( DecorationObject.numId > 1000 ) DecorationObject.numId = 0;
        this.id = DecorationObject.numId ++;

        this.rotation = params.rotation || 0;
        this.position.set( params.position.x, params.position.y, params.position.z );

    };

};
