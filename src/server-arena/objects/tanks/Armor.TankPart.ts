/*
 * @author ohmed
 * Tank Armor part
*/

export class ArmorTankPart {

    public nid: number;
    public title: string;

    public armor: number;

    //

    constructor ( params: any, level: number ) {

        this.nid = params.nid;
        this.title = params.title;

        this.armor = params.levels[ level ].armor;

    };

};
