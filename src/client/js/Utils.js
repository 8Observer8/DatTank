/*
 * @author ohmed
 * DatTank utils functions
*/

var Utils = {};

Utils.ge = function ( selector ) {

    return document.querySelector( selector );

};

Utils.ges = function ( selector ) {

    return document.querySelectorAll( selector );

};

Utils.getDistance = function ( v1, v2 ) {

    return Math.sqrt( Math.pow( v1.x - v2.x, 2 ) + Math.pow( v1.z - v2.z, 2 ) );

};

Utils.getScreenPos = (function () {

    var point = new THREE.Vector3();
    var result = new THREE.Vector2();

    return function ( x, y, z, camera ) {

        point.set( x, y, z );

        var widthHalf = view.SCREEN_WIDTH / 2;
        var heightHalf = view.SCREEN_HEIGHT / 2;
        var vector = point.project( camera );

        result.x = ( vector.x * widthHalf ) + widthHalf,
        result.y = - ( vector.y * heightHalf ) + heightHalf

        return result;

    };

}) ();

Utils.formatAngle = function ( a ) {

    a = a % ( 2 * Math.PI );

    if ( a < 0 ) {

        a += 2 * Math.PI;

    }

    return a;

};

Utils.addAngle = function ( a1, a2 ) {

    return Utils.formatAngle( a1 + a2 );

};
