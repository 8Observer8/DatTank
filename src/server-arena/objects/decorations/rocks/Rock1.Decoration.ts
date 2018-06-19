/*
 * @author ohmed
 * Rock1 map decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";
import { DecorationObject } from "./../../core/Decoration.Object";
import { ArenaCore } from "./../../../core/Arena.Core";

//

class Rock1Decoration extends DecorationObject {

    public static canPlace ( arena: ArenaCore, position: OMath.Vec3 ) {

        return arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x, 0, position.z + 50 ), 15 ) && arena.collisionManager.isPlaceFree( new OMath.Vec3( position.x, 0, position.z - 50 ), 15 );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Rock1';

        let sizeXZ = 5 * Math.random() + 20;
        this.scale = new OMath.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );
        this.size.set( 0.8 * this.scale.x, 0.8 * this.scale.y, 0.8 * this.scale.z );
        this.rotation = Math.PI / 2;

        this.arena.collisionManager.addObject( { position: { x: this.position.x, z: this.position.z + 50 }, radius: 14 }, 'circle', false );
        this.arena.collisionManager.addObject( { position: { x: this.position.x, z: this.position.z - 50 }, radius: 14 }, 'circle', false );

    };

};

//

export { Rock1Decoration };
