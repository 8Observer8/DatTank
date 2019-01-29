/*
 * @author ohmed
 * DatTank Rock decoration
*/

import * as OMath from '../../../OMath/Core.OMath';

import { DecorationObject } from '../../../objects/core/Decoration.Object';
import { CollisionManager } from '../../../managers/arena/Collision.Manager';

//

export class Rock1Decoration extends DecorationObject {

    public static title: string = 'Rock1';
    public size: OMath.Vec3 = new OMath.Vec3();

    //

    constructor ( params: any ) {

        super( params );
        this.title = Rock1Decoration.title;
        this.uvOffset.set( 0, 0 );
        this.size.set( 1.2 * this.scale.x, 100, 1.2 * this.scale.z );

        CollisionManager.addObject( { rotation: 0, position: new OMath.Vec3( this.position.x, 0, this.position.z + 40 ), size: this.size }, 'box', false );
        CollisionManager.addObject( { rotation: 0, position: new OMath.Vec3( this.position.x, 0, this.position.z - 45 ), size: this.size }, 'box', false );

    };

};
