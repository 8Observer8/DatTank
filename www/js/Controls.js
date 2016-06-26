/*
 * @author ohmed
 * DatTank mouse/keys controls
*/

DT.Controls = function () {

    this.pressedKey = false;
    this.pressedMouseKey = false;

    this.mousePos = new THREE.Vector2( 0.5, 0.5 );
    this.prevMousePos = new THREE.Vector2( 0.5, 0.5 );

};

DT.Controls.prototype = {};

DT.Controls.prototype.clear = function () {

    // todo

};

DT.Controls.prototype.mouseInit = function () {

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

                DT.arena.me.shoot();
                break;

            case 2:

                break;

            case 3:

                view.raycaster.setFromCamera( scope.mousePos, view.camera );

                var intersections = view.raycaster.intersectObjects( [ view.scene.ground ] );

                if ( intersections[0] && intersections[0].object.name === 'ground' ) {

                    DT.arena.me.move( intersections[0].point );
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

DT.Controls.prototype.keyInit = function () {

    function keyDown ( event ) {

        switch ( event.keyCode ) {

            case 80: // 'p' key

                Utils.ge('#stats').style['display'] = 'block';
                break;

        }

    };

    function keyUp ( event ) {

        // todo

    };

    //

    document.addEventListener( 'keydown', keyDown );
    document.addEventListener( 'keyup', keyUp );

};
