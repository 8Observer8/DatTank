/*
 * @author ohmed
 * DatTank Tower T1
*/

import { TowerObject } from '../../objects/core/Tower.Object';

//

export class T1Tower extends TowerObject {

    public static title: string = 'T1';
    public static tid = 0;

    public static bullet: number = 76;
    public static rpm: number = 16.7 * 10;
    public static armour: number = 102;

    //

    constructor ( params: any ) {

        super( params );

        //

        this.bullet = T1Tower.bullet;
        this.rpm = T1Tower.rpm;
        this.armour = T1Tower.armour;
        this.title = T1Tower.title;

    };

};
