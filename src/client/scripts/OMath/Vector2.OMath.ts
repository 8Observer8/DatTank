/*
 * @author ohmed
 * DatTank Math Vector2
*/

export class Vec2 {

    public x: number = 0;
    public y: number = 0;

    //

    public set ( x: number, y: number ) : void {

        this.x = x;
        this.y = y;

    };

    public length () : number {

        return Math.sqrt( this.x * this.x + this.y * this.y );

    };

    public distanceTo ( point: Vec2 ) : number {

        const dx = this.x - point.x;
        const dy = this.y - point.y;

        return Math.sqrt( dx * dx + dy * dy );

    };

    public copy ( point: Vec2 ) : void {

        this.x = point.x;
        this.y = point.y;

    };

    public clone () : Vec2 {

        return new Vec2( this.x, this.y );

    };

    //

    constructor ( x?: number, y?: number ) {

        this.x = x || 0;
        this.y = y || 0;

    };

};
