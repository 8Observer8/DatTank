/*
 * @author ohmed
 * Tree1 map decoration
*/

import * as OMath from '../../../OMath/Core.OMath';
import { DecorationObject } from '../../core/Decoration.Object';
import { ArenaCore } from '../../../core/Arena.Core';

//

class Tree1Decoration extends DecorationObject {

    public radius: number = 10;

    public static canPlace ( arena: ArenaCore, position: OMath.Vec3 ) : boolean {

        return arena.collisionManager.isPlaceFree( position, 20 );

    };

    //

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        this.type = 'Tree1';

        const sizeXZ = 15 * Math.random() + 45;
        this.scale.set( sizeXZ, 15 * Math.random() + 40, sizeXZ );
        this.rotation = Math.random() * Math.PI * 2;

        this.arena.collisionManager.addObject( this, 'circle', false );

    };

};

//

export { Tree1Decoration };
