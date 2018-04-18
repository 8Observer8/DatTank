/*
 * @author ohmed
 * DatTank Math Vector3
*/

export class Vec3 {

    public x: number;
    public y: number;
    public z: number;

    //

    public set ( x: number, y: number, z: number ) {

        this.x = x;
        this.y = y;
        this.z = z;

    };

    public distanceTo ( point: Vec3 | THREE.Vector3 ) {

        let dx = this.x - point.x;
        let dy = this.y - point.y;
        let dz = this.z - point.z;

        return Math.sqrt( dx * dx + dy * dy + dz * dz );

    };

    //

    constructor ( x?: number, y?: number, z?: number ) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

    };

};
