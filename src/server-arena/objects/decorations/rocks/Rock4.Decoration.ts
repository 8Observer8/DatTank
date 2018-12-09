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

        return arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x, 0, position.z ), 15 );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Rock4';

        let sizeXZ = 5 * Math.random() + 20;
        this.scale = new OMath.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );
        this.size.set( 2.6 * this.scale.x, 70, 2.6 * this.scale.z );
        this.rotation = Math.random() * Math.PI * 2;

        this.arena.collisionManager.addObject( this, 'box', false );

    };

};

//

export { Rock4Decoration };
