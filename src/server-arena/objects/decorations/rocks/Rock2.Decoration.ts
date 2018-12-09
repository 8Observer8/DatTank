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

        return arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x - 20, 0, position.z ), 15 ) && arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x + 20, 0, position.z ), 15 );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Rock2';

        let sizeXZ = 5 * Math.random() + 20;
        this.scale = new OMath.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );
        this.size.set( 7 * this.scale.x, 100, 2.5 * this.scale.z );
        this.rotation = Math.PI / 2;

        this.arena.collisionManager.addObject( this, 'box', false );

    };

};

//

export { Rock2Decoration };
