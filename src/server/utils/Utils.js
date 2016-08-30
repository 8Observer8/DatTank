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

module.exports = Utils;
