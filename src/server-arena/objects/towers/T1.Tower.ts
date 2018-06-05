/*
 * @author ohmed
 * Tower "T1" unit class
*/

import { TowerObject } from "./../core/Tower.Object";
import { ArenaCore } from "./../../core/Arena.Core";

//

class T1Tower extends TowerObject {

    constructor ( arena: ArenaCore, params: any ) {

        super( arena, params );

        //

        this.title = 'T1';

    };

};

//

export { T1Tower };
