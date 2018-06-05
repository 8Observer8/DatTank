/*
 * @author ohmed
 * DatTank Math Vector2
*/

export class Vec2 {

    public x: number = 0;
    public y: number = 0;

    //

    public set ( x: number, y: number ) {

        this.x = x;
        this.y = y;

    };

    public length () {

        return Math.sqrt( this.x * this.x + this.y * this.y );

    };

    public sum ( vec: Vec2 ) {

        return new Vec2( this.x + vec.x, this.y + vec.y );

    };

    public distanceTo ( point: Vec2 ) {

        let dx = this.x - point.x;
        let dy = this.y - point.y;

        return Math.sqrt( dx * dx + dy * dy );

    };

    public copy ( point: Vec2 ) {

        this.x = point.x;
        this.y = point.y;

    };

    public clone () {

        return new Vec2( this.x, this.y );

    };

    public toJSON () {

        return {
            x:  this.x,
            y:  this.y
        };

    };

    //

    constructor ( x?: number, y?: number ) {

        this.x = x || 0;
        this.y = y || 0;

    };

};
