/*
 * @author ohmed
 * Rock4 map decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";
import { DecorationObject } from "./../../core/Decoration.Object";
import { ArenaCore } from "./../../../core/Arena.Core";

//

class Rock4Decoration extends DecorationObject {

    public static canPlace ( arena: ArenaCore, position: OMath.Vec3 ) {

        return arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x, 0, position.z ), 20 );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Rock4';

        var sizeXZ = 5 * Math.random() + 20;
        this.scale = new OMath.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );
        this.size.set( 0.8 * this.scale.x, 0.02 * this.scale.y, 0.8 * this.scale.z );
        this.radius = 20;
        this.rotation = Math.random() * Math.PI * 2;

        this.arena.collisionManager.addObject( this, 'circle', false );

    };

};

//

export { Rock4Decoration };
