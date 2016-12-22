/*
 * @author ohmed
 * DatTank mouse/keys controls
*/

Game.ControlsManager = function () {

    this.pressedKey = false;
    this.pressedMouseKey = false;

    this.mousePos = new THREE.Vector2( 0.5, 0.5 );
    this.prevMousePos = new THREE.Vector2( 0.5, 0.5 );

    this.moveForward = false;
    this.moveBackward = false;
    this.rotateLeft = false;
    this.rotateRight = false;

};

Game.ControlsManager.prototype = {};

Game.ControlsManager.prototype.mouseInit = function () {

    var scope = this;

    // disable right mouse click

    document.oncontextmenu = function () { return false; };

    //

    function mouseDown ( event ) {

        var mouseX = event.clientX;
        var mouseY = event.clientY;

        scope.mousePos.x = ( event.clientX / view.SCREEN_WIDTH ) * 2 - 1;
        scope.mousePos.y = - ( event.clientY / view.SCREEN_HEIGHT ) * 2 + 1;

        var mouseKeyPressed = event.which;

        switch ( mouseKeyPressed ) {

            case 1:

                scope.shoot();
                break;

            case 2:

                break;

            case 3:

                view.raycaster.setFromCamera( scope.mousePos, view.camera );

                var intersections = view.raycaster.intersectObjects( [ view.scene.ground ] );

                if ( intersections[0] && intersections[0].object.name === 'ground' ) {

                    scope.moveToPoint( intersections[0].point );
                    view.showDestinationPoint( intersections[0].point );

                }

                break;

        }

    };

    function mouseMove ( event ) {

        var mouseX = event.clientX;
        var mouseY = event.clientY;

        scope.mousePos.x = ( event.clientX / view.SCREEN_WIDTH ) * 2 - 1;
        scope.mousePos.y = - ( event.clientY / view.SCREEN_HEIGHT ) * 2 + 1;

    };

    function mouseUp ( event ) {

        // todo

    };

    //

    var viewport = Utils.ge('#viewport');

    viewport.addEventListener( 'mousedown', mouseDown );
    viewport.addEventListener( 'mousemove', mouseMove );
    viewport.addEventListener( 'mouseup', mouseUp );

};

Game.ControlsManager.prototype.keyInit = function () {

    var scope = this;

    function keyDown ( event ) {

        scope.pressedKey[ event.keyCode ] = true;

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                if ( scope.moveForward ) break;
                scope.moveForward = true;
                scope.move( 1 );
                break;

            case 37: // left
            case 65: // a
                if ( scope.rotateLeft ) break;
                scope.rotateLeft = true;
                scope.rotateBase( 1 );
                break;

            case 40: // down
            case 83: // s
                if ( scope.moveBackward ) break;
                scope.moveBackward = true;
                scope.move( -1 );
                break;

            case 39: // right
            case 68: // d
                if ( scope.rotateRight ) break;
                scope.rotateRight = true;
                scope.rotateBase( -1 );
                break;

            case 80: // 'p' key

                Utils.ge('#stats').style['display'] = 'block';
                break;

        }

    };

    function keyUp ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                scope.moveForward = false;
                scope.move( 0 );
                break;

            case 37: // left
            case 65: // a
                scope.rotateLeft = false;
                scope.rotateBase( 0 );
                break;

            case 40: // down
            case 83: // s
                scope.moveBackward = false;
                scope.move( 0 );
                break;

            case 39: // right
            case 68: // d
                scope.rotateRight = false;
                scope.rotateBase( 0 );
                break;

        }

        delete scope.pressedKey[ event.keyCode ];

    };

    //

    document.addEventListener( 'keydown', keyDown );
    document.addEventListener( 'keyup', keyUp );

};

//

Game.ControlsManager.prototype.rotateTop = (function () {

    var buffer = new ArrayBuffer( 4 );
    var bufferView = new Int16Array( buffer );
    var lastUpdateTime = Date.now();

    return function ( angle ) {

        var me = Game.arena.me;
        if ( ! me.tank.object.top ) return;

        if ( Date.now() - lastUpdateTime > 50 ) {

            lastUpdateTime = Date.now();

            bufferView[ 1 ] = Math.floor( angle * 10 );

            network.send( 'rotateTop', buffer, bufferView );

        }

    };

}) ();

Game.ControlsManager.prototype.rotateBase = (function () {

    var buffer = new ArrayBuffer( 4 );
    var bufferView = new Int16Array( buffer );

    return function ( direction ) {

        bufferView[ 0 ] = 0;
        bufferView[ 1 ] = direction;

        network.send( 'PlayerTankRotateBase', buffer, bufferView );

    };

}) ();

Game.ControlsManager.prototype.shoot = function () {

    network.send( 'shoot' );

};

Game.ControlsManager.prototype.move = (function () {

    var buffer = new ArrayBuffer( 4 );
    var bufferView = new Int16Array( buffer );

    return function ( direction ) {

        bufferView[ 0 ] = 0;
        bufferView[ 1 ] = direction;

        network.send( 'PlayerTankMove', buffer, bufferView );

    };

}) ();

Game.ControlsManager.prototype.moveToPoint = (function () {

    var buffer = new ArrayBuffer( 6 );
    var bufferView = new Int16Array( buffer );

    return function ( destination ) {

        if ( Game.arena.me.status !== 'alive' ) {

            return;

        }

        bufferView[1] = destination.x;
        bufferView[2] = destination.z;

        network.send( 'PlayerTankMoveToPoint', buffer, bufferView );

    };

}) ();
