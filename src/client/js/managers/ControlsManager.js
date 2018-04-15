/*
 * @author ohmed
 * DatTank mouse/keys controls
*/

Game.ControlsManager.prototype.rotateTop = (function () {

    var buffer = new ArrayBuffer( 4 );
    var bufferView = new Int16Array( buffer );
    var lastUpdateTime = Date.now();

    return function ( angle ) {

        var me = Game.arena.me;
        angle -= Game.arena.me.tank.object.rotation.y;

        if ( Date.now() - lastUpdateTime > 100 ) {

            lastUpdateTime = Date.now();
            bufferView[ 1 ] = Math.floor( angle * 1000 );
            network.send( 'PlayerTankRotateTop', buffer, bufferView );

        }

    };

}) ();

Game.ControlsManager.prototype.shoot = function () {

    var buffer = new ArrayBuffer( 2 );
    var bufferView = new Int16Array( buffer );

    network.send( 'PlayerTankShoot', buffer, bufferView );

};

Game.ControlsManager.prototype.move = ( function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Int16Array( buffer );

    return function () {

        var scope = this;

        bufferView[ 0 ] = 0;
        bufferView[ 1 ] = scope.notMoveX ? 0 : scope.moveX;
        bufferView[ 2 ] = scope.notMoveZ ? 0 : scope.moveZ;

        network.send( 'PlayerTankMove', buffer, bufferView );

    };

}) ();
