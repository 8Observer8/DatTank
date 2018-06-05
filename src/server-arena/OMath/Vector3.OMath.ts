/*
 * @author ohmed
 * DatTank Math Vector3
*/

export class Vec3 {

    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    //

    public set ( x: number, y: number, z: number ) {

        this.x = x;
        this.y = y;
        this.z = z;

    };

    public length () {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    };

    public sum ( vec: Vec3 ) {

        return new Vec3( this.x + vec.x, this.y + vec.y, this.z + vec.z );

    };

    public distanceTo ( point: Vec3 ) {

        let dx = this.x - point.x;
        let dy = this.y - point.y;
        let dz = this.z - point.z;

        return Math.sqrt( dx * dx + dy * dy + dz * dz );

    };

    public copy ( point: Vec3 ) {

        this.x = point.x;
        this.y = point.y;
        this.z = point.z;

    };

    public clone () {

        return new Vec3( this.x, this.y, this.z );

    };

    public toJSON () {

        return {
            x:  this.x,
            y:  this.y,
            z:  this.z
        };

    };

    //

    constructor ( x?: number, y?: number, z?: number ) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

    };

};
