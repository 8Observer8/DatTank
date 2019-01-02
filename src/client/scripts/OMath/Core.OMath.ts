/*
 * @author ohmed
 * DatTank Math core
*/

import { Vec2 } from './Vector2.OMath';
import { Vec3 } from './Vector3.OMath';

export { Vec2 };
export { Vec3 };

//

export function darkerColor ( value: number, coef: number ) : number {

    let r = Math.floor( value / 65536 );
    let g = Math.floor( value / 256 ) % 256;
    let b = value % 256;

    r = Math.min( Math.floor( r * coef ), 255 );
    g = Math.min( Math.floor( g * coef ), 255 );
    b = Math.min( Math.floor( b * coef ), 255 );

    return r * 65536 + g * 256 + b;

};

export function intToHex ( value: number ) : string {

    let result = value.toString(16);
    while ( result.length < 6 ) {

        result = '0' + result;

    }

    return '#' + result;

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

    if (angle > Math.PI ) angle -= 2 * Math.PI;
    if ( angle < - Math.PI ) angle += 2 * Math.PI;

    return angle;

};
