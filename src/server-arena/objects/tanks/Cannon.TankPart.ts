/*
 * @author ohmed
 * Tank Cannon part
*/

export class CannonTankPart {

    public nid: number;
    public title: string;

    public rpm: number;
    public damage: number;
    public overheat: number;
    public range: number;

    public temperature: number;

    //

    constructor ( params: any, level: number ) {

        this.nid = params.nid;
        this.title = params.title;

        this.rpm = params.levels[ level ].rpm;
        this.damage = params.levels[ level ].damage;
        this.overheat = params.levels[ level ].overheat;
        this.range = params.levels[ level ].range;

        this.temperature = 0;

    };

};
