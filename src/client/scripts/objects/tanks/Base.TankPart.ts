/*
 * @author ohmed
 * Tank Base part
*/

export class BaseTankPart {

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
