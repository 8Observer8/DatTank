/*
 * @author ohmed
 * Ruins1 map decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";
import { DecorationObject } from "./../../core/Decoration.Object";
import { ArenaCore } from "./../../../core/Arena.Core";

//

class Ruins1Decoration extends DecorationObject {

    public static canPlace ( arena: ArenaCore, position: OMath.Vec3 ) {

        return arena.collisionManager.isPlaceFree( position, 4.5 * 12 );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Ruins1';

        let sizeXZ = 5 * Math.random() + 20;
        this.scale.set( sizeXZ, 15, sizeXZ );
        this.size.set( 4.5 * this.scale.x, 4.5 * this.scale.y, 4.5 * this.scale.z );
        this.rotation = Math.random() * Math.PI * 2;
        this.radius = 0.5;

        this.arena.collisionManager.addObject( this, 'circle', false );

    };

};

//

export { Ruins1Decoration };
