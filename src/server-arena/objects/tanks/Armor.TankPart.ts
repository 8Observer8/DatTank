/*
 * @author ohmed
 * Tank Armor part
*/

export class ArmorTankPart {

    public nid: number;
    public title: string;

    public armor: number;

    //

    constructor ( params: any ) {

        this.nid = params.nid;
        this.title = params.title;

        this.armor = params.armor;

    };

};
