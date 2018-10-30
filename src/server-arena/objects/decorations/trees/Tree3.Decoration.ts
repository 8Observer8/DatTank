/*
 * @author ohmed
 * Tree3 map decoration
*/

import * as OMath from '../../../OMath/Core.OMath';
import { DecorationObject } from '../../core/Decoration.Object';
import { ArenaCore } from '../../../core/Arena.Core';

//

class Tree3Decoration extends DecorationObject {

    public radius: number = 20;

    public static canPlace ( arena: ArenaCore, position: OMath.Vec3 ) : boolean {

        return arena.collisionManager.isPlaceFree( position, 40 );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Tree3';

        const sizeXZ = 15 * Math.random() + 30;
        this.scale.set( sizeXZ, 15 * Math.random() + 30, sizeXZ );
        this.rotation = Math.random() * Math.PI * 2;

        this.arena.collisionManager.addObject( this, 'circle', false );

    };

};

//

export { Tree3Decoration };
