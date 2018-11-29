/*
 * @author ohmed
 * Tank Hull part
*/

export class HullTankPart {

    public nid: number;
    public title: string;

    public armorCoef: number;
    public speedCoef: number;
    public ammoCapacity: number;

    //

    constructor ( params: any ) {

        this.nid = params.nid;
        this.armorCoef = params.armorCoef;
        this.speedCoef = params.speedCoef;
        this.ammoCapacity = params.ammoCapacity;

    };

};
