/*
 * @author ohmed
 * DatTank Tower T1
*/

import { TowerCore } from "./../../core/objects/Tower.Core";

//

class T1Tower extends TowerCore {

    static title: string = 'T1';
    static tid = 0;

    static bullet: number = 76;
    static rpm: number = 16.7 * 10;
    static armour: number = 102;

    //

    constructor ( params ) {

        super( params );

        //

        this.bullet = T1Tower.bullet;
        this.rpm = T1Tower.rpm;
        this.armour = T1Tower.armour;
        this.title = T1Tower.title;

    };

};

//

export { T1Tower };