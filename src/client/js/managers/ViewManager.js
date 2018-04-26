
Game.ViewManager.prototype.addCameraShake = function ( duration, intensity ) {

    var iter = 0;
    var scope = this;

    if ( this.shakeInterval !== false ) {

        clearInterval( this.shakeInterval );
        this.cameraOffset.set( 0, 0, 0 );

    }

    this.shakeInterval = setInterval( function () {

        scope.cameraOffset.x = intensity * ( Math.random() - 0.5 ) * iter / 2;
        scope.cameraOffset.y = intensity * ( Math.random() - 0.5 ) * iter / 2;
        scope.cameraOffset.z = intensity * ( Math.random() - 0.5 ) * iter / 2;

        iter ++;

        if ( iter > Math.floor( ( duration - 100 ) / 40 ) ) {

            clearInterval( scope.shakeInterval );
            scope.cameraOffset.set( 0, 0, 0 );
            scope.shakeInterval = false;

        }

    }, 40 );

};
