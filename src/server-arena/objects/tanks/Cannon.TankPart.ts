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

    constructor ( params: any ) {

        this.nid = params.nid;
        this.title = params.title;

        this.rpm = params.rpm;
        this.damage = params.damage;
        this.overheat = params.overheat;
        this.range = params.range;

        this.temperature = 0;

    };

};
