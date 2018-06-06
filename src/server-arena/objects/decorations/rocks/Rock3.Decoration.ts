/*
 * @author ohmed
 * Rock3 map decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";
import { DecorationObject } from "./../../core/Decoration.Object";
import { ArenaCore } from "./../../../core/Arena.Core";

//

class Rock3Decoration extends DecorationObject {

    public static canPlace ( arena: ArenaCore, position: OMath.Vec3 ) {

        return true;

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Rock3';

        let sizeXZ = 5 * Math.random() + 20;
        this.scale = new OMath.Vec3( sizeXZ, 5 * Math.random() + 20, sizeXZ );
        this.size.set( 0.8 * this.scale.x, 0.02 * this.scale.y, 0.8 * this.scale.z );
        this.rotation = Math.random() * Math.PI * 2;

    };

};

//

export { Rock3Decoration };
