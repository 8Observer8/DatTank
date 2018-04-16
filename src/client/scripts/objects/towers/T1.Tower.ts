/*
 * @author ohmed
 * DatTank Tower T1
*/

import { TowerCore } from "./../../core/objects/Tower.Core";

//

class T1Tower extends TowerCore {

    static title: string = 'T1';
    static tid = 0;

    //

    constructor ( params ) {

        super( params );

        //

        this.title = T1Tower.title;

    };

};

//

export { T1Tower };
