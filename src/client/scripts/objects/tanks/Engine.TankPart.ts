/*
 * @author ohmed
 * Tank Engine part
*/

export class EngineTankPart {

    public nid: number;
    public maxSpeed: number;
    public power: number;

    //

    constructor ( params: any ) {

        this.nid = params.nid;
        this.maxSpeed = params.maxSpeed;
        this.power = params.power;

    };

};
