/*
 * @author ohmed
 * DatTank Rock decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";

import { DecorationObject } from "./../../../objects/core/Decoration.Object";
import { CollisionManager } from "./../../../managers/Collision.Manager";

//

class Rock4Decoration extends DecorationObject {

    static title: string = 'Rock4';
    public size: OMath.Vec3 = new OMath.Vec3();

    //

    constructor ( params: any ) {

        super( params );
        this.title = Rock4Decoration.title;
        this.uvOffset.set( 0, 1 );
        this.size.set( 2.6 * this.scale.x, 70, 2.6 * this.scale.z );

        CollisionManager.addObject( this, 'box', false );

    };

};

//

export { Rock4Decoration };
