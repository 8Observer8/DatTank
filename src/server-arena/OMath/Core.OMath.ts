/*
 * @author ohmed
 * DatTank Math core
*/

import { Vec2 } from './Vector2.OMath';
import { Vec3 } from './Vector3.OMath';

export { Vec2 };
export { Vec3 };

//

export function sortByProperty ( array: object[], property: string ) : object[] {

    for ( let i = 0; i < array.length; i ++ ) {

        for ( let j = i; j < array.length; j ++ ) {

            if ( array[ i ][ property ] < array[ j ][ property ] ) {

                const tmp = array[ i ];
                array[ i ] = array[ j ];
                array[ j ] = tmp;

            }

        }

    }

    return array;

};

export function sign ( value: number ) : number {

    if ( value >= 0 ) {

        return 1;

    } else {

        return -1;

    }

};

export function formatAngle ( angle: number ) : number {

    angle = angle % ( 2 * Math.PI );
    if ( Math.abs( angle + 2 * Math.PI ) < Math.abs( angle ) ) angle += 2 * Math.PI;
    if ( Math.abs( angle - 2 * Math.PI ) < Math.abs( angle ) ) angle -= 2 * Math.PI;

    return angle;

};
