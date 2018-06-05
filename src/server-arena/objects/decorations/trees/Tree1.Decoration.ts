/*
 * @author ohmed
 * Tree1 map decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";
import { DecorationObject } from "./../../core/Decoration.Object";
import { ArenaCore } from "./../../../core/Arena.Core";

//

class Tree1Decoration extends DecorationObject {

    public static canPlace ( arena: ArenaCore, position: OMath.Vec3 ) {

        return arena.collisionManager.isPlaceFree( position, 40 );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Tree1';

        let sizeXZ = 15 * Math.random() + 45;
        this.scale.set( sizeXZ, 15 * Math.random() + 40, sizeXZ );
        this.size.set( 0.8 * this.scale.x, 0.2 * this.scale.y, 0.8 * this.scale.z );
        this.rotation = Math.random() * Math.PI * 2;
        this.radius = 1;

        this.arena.collisionManager.addObject( this, 'circle', false );

    };

};

//

export { Tree1Decoration };
