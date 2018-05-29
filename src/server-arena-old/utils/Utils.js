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

Utils.addAngle = function ( a1, a2 ) {

    return Utils.formatAngle( a1 + a2 );

};

//

module.exports = Utils;
