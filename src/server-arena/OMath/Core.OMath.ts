/*
 * @author ohmed
 * DatTank Math core
*/

import { Vec2 } from "./Vector2.OMath";
import { Vec3 } from "./Vector3.OMath";

export { Vec2 };
export { Vec3 };

//

export function sortByProperty ( array: Array<object>, property: string ) {

    for ( var i = 0; i < array.length; i ++ ) {

        for ( var j = i; j < array.length; j ++ ) {

            if ( array[ i ][ property ] < array[ j ][ property ] ) {

                var tmp = array[ i ];
                array[ i ] = array[ j ];
                array[ j ] = tmp;

            }

        }

    }

    return array;

};

export function sign ( value: number ) {

    if ( value >= 0 ) {

        return 1;

    } else {

        return -1;

    }

};

export function formatAngle ( angle: number ) {

    angle = angle % ( 2 * Math.PI );

    if ( angle < 0 ) {

        angle += 2 * Math.PI;

    }

    return angle;

};
