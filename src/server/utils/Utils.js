/*
 * @author ohmed
 * Main server utils functions
*/

var Utils = {};

Utils.formatAngle = function ( angle ) {

    angle = angle % ( 2 * Math.PI );

    if ( angle < 0 ) {

        angle += 2 * Math.PI;

    }

    return angle;

};

Utils.getDistance = function ( a, b ) {

    return Math.sqrt( Math.pow( a.x - b.x, 2 ) + Math.pow( a.z - b.z, 2 ) );

};

Utils.formatAngle = function ( a ) {

    a = a % ( 2 * Math.PI );

    if ( a < 0 ) {

        a += 2 * Math.PI;

    }

    return a;

};

//

module.exports = Utils;
