/*
 * @author ohmed
 * DatTank Math Vector2
*/

export class Vec2 {

    public x: number;
    public y: number;

    //

    public set ( x: number, y: number ) {

        this.x = x;
        this.y = y;

    };

    public distanceTo ( point: Vec2 ) {

        let dx = this.x - point.x;
        let dy = this.y - point.y;

        return Math.sqrt( dx * dx + dy * dy );

    };

    //

    constructor ( x?: number, y?: number ) {

        this.x = x || 0;
        this.y = y || 0;

    };

};
