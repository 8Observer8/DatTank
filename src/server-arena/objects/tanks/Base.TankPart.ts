/*
 * @author ohmed
 * Tank Base part
*/

export class BaseTankPart {

    public nid: number;
    public title: string;

    public cannonCoef: number;
    public armorCoef: number;
    public speedCoef: number;
    public ammoCapacity: number;

    //

    constructor ( params: any, level: number ) {

        this.nid = params.nid;
        this.title = params.title;

        this.cannonCoef = params.levels[ level ].cannonCoef;
        this.armorCoef = params.levels[ level ].armorCoef;
        this.speedCoef = params.levels[ level ].speedCoef;
        this.ammoCapacity = params.levels[ level ].ammoCapacity;

    };

};
