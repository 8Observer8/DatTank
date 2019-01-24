/*
 * @author ohmed
 * DatTank Math Vector3
*/

import * as THREE from 'three';

//

export class Vec3 {

    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    //

    public static dist ( v1: Vec3 | THREE.Vector3, v2: Vec3 | THREE.Vector3 ) : number {

        return Math.sqrt( Math.pow( v1.x - v2.x, 2 ) + Math.pow( v1.z - v2.z, 2 ) );

    };

    //

    public add ( dx: number, dy: number, dz: number ) : Vec3 {

        this.x += dx;
        this.y += dy;
        this.z += dz;

        return this;

    };

    public sub ( dx: number, dy: number, dz: number ) : Vec3 {

        this.x -= dx;
        this.y -= dy;
        this.z -= dz;

        return this;

    };

    public set ( x: number, y: number, z: number ) : void {

        this.x = x;
        this.y = y;
        this.z = z;

    };

    public length () : number {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    };

    public distanceTo ( point: Vec3 | THREE.Vector3 ) : number {

        const dx = this.x - point.x;
        const dy = this.y - point.y;
        const dz = this.z - point.z;

        return Math.sqrt( dx * dx + dy * dy + dz * dz );

    };

    public copy ( point: Vec3 | THREE.Vector3 ) : void {

        this.x = point.x;
        this.y = point.y;
        this.z = point.z;

    };

    public clone () : Vec3 {

        return new Vec3( this.x, this.y, this.z );

    };

    //

    constructor ( x?: number, y?: number, z?: number ) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

    };

};
