/*
 * @author ohmed
 * DatTank Rock decoration
*/

import { DecorationObject } from "./../../../objects/core/Decoration.Object";

//

class Rock3Decoration extends DecorationObject {

    static title: string = 'Rock3';

    //

    constructor ( params: any ) {

        super( params );
        this.title = Rock3Decoration.title;
        this.uvOffset.set( 2, 0 );

    };

};

//

export { Rock3Decoration };
