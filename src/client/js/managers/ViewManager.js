/*
 * @author ohmed
 * DatTank Scene Rendering core
*/

Game.ViewManager.prototype.addObjectShadow = function ( objectType, position, scale, rotation ) {

    var shadowTexture;
    var shadowMesh;
    var shadowScale;

    //

    if ( objectType.indexOf('tree') !== -1 ) {

        shadowScale = 5 * scale.y;
        shadowTexture = resourceManager.getTexture( objectType + '-shadow.png' );
        shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.48 }) );
        shadowMesh.material.transparent = true;
        shadowMesh.rotation.x = - Math.PI / 2;
        shadowMesh.position.copy( position );
        shadowMesh.position.y += 0.5;
        shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
        shadowMesh.position.x += 2 * shadowMesh.scale.y / 2 - 2;
        shadowMesh.position.z += 2 * shadowMesh.scale.y / 2 - 4;
        shadowMesh.renderOrder = 10;
        this.scene.add( shadowMesh );

    }

    if ( objectType.indexOf('stone') !== -1 ) {

        if ( objectType === 'stone3' ) {

            shadowScale = scale.y;

        } else {
            
            shadowScale = 5 * scale.y;

        }

        shadowTexture = resourceManager.getTexture( objectType + '-shadow.png' );
        shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.48 }) );
        shadowMesh.material.transparent = true;
        shadowMesh.rotation.x = - Math.PI / 2;
        shadowMesh.position.copy( position );
        shadowMesh.position.y += 0.5;
        shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
        shadowMesh.position.x += shadowMesh.scale.y / 2;
        shadowMesh.position.z += shadowMesh.scale.y / 2;
        shadowMesh.renderOrder = 10;
        this.scene.add( shadowMesh );

    }

};

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
