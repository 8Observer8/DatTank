/*
 * @author ohmed
 * Rock2 map decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";
import { DecorationObject } from "./../../core/Decoration.Object";
import { ArenaCore } from "./../../../core/Arena.Core";

//

class Rock2Decoration extends DecorationObject {

    public static canPlace ( arena: ArenaCore, position: OMath.Vec3 ) {

        return arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x, 0, position.z - 20 ), 20 ) && arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x, 0, position.z + 20 ), 20 );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Rock2';

        let sizeXZ = 5 * Math.random() + 20;
        this.scale = new OMath.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );
        this.size.set( 2 * this.scale.x, 0.8 * this.scale.y, 7 * this.scale.z );
        this.rotation = Math.PI / 2;

        this.arena.collisionManager.addObject( this, 'box', false );

    };

};

//

export { Rock2Decoration };
