/*
 * @author ohmed
 * DatTank Rock decoration
*/

import * as OMath from "./../../../OMath/Core.OMath";

import { DecorationObject } from "./../../../objects/core/Decoration.Object";
import { CollisionManager } from "./../../../managers/Collision.Manager";

//

class Rock2Decoration extends DecorationObject {

    static title: string = 'Rock2';
    public size: OMath.Vec3 = new OMath.Vec3();

    //

    constructor ( params: any ) {

        super( params );
        this.title = Rock2Decoration.title;
        this.uvOffset.set( 1, 0 );
        this.size.set( 7 * this.scale.x, 100, 2.5 * this.scale.z );

        CollisionManager.addObject( this, 'box', false );

    };

};

//

export { Rock2Decoration };
