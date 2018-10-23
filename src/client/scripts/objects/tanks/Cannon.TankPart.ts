/*
 * @author ohmed
 * Tank Cannon part
*/

export class CannonTankPart {

    public nid: number;

    public rpm: number;
    public overheat: number;
    public range: number;

    //

    constructor ( params: any ) {

        this.nid = params.nid;
        this.rpm = params.rpm;
        this.overheat = params.overheat;
        this.range = params.range;

    };

};
