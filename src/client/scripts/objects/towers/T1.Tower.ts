/*
 * @author ohmed
 * DatTank Tower T1
*/

import { TowerObject } from '../../objects/core/Tower.Object';

//

export class T1Tower extends TowerObject {

    public static title: string = 'T1';
    public static tid = 0;

    public static damage: number = 76;
    public static rpm: number = 16.7 * 10;
    public static armor: number = 102;

    //

    constructor ( params: any ) {

        super( params );

        //

        this.damage = T1Tower.damage;
        this.rpm = T1Tower.rpm;
        this.armor = T1Tower.armor;
        this.title = T1Tower.title;

    };

};
