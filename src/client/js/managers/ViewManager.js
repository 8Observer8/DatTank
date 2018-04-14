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

Game.ViewManager.prototype.addTeamZone = function () {

    var team;
    var name, color, x, z;
    var plane;
    var baseTexture = resourceManager.getTexture( 'Base-ground.png' );

    for ( var i = 0, il = Game.arena.teamManager.teams.length; i < il; i ++ ) {

        if ( Game.arena.teamManager.teams[ i ].id >= 1000 ) continue;

        team = Game.arena.teamManager.teams[ i ];

        name = team.name;
        color = + team.color.replace('#', '0x');
        x = team.spawnPosition.x;
        z = team.spawnPosition.z;

        plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 200, 200 ), new THREE.MeshBasicMaterial({ map: baseTexture, color: color, transparent: true, opacity: 0.9, depthWrite: false }) );

        plane.material.color.r = plane.material.color.r / 3 + 0.4;
        plane.material.color.g = plane.material.color.g / 3 + 0.4;
        plane.material.color.b = plane.material.color.b / 3 + 0.4;

        plane.rotation.x = - Math.PI / 2;
        plane.position.set( x, 2, z );
        plane.renderOrder = 9;
        this.scene.add( plane );
        plane.name = 'team-spawn-plane-' + name;

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

//

Game.ViewManager.prototype.animate = function ( delta ) {

    if ( ! Game.arena || ! Game.arena.me ) return;

    this.updateCamera();

    if ( Game.arena.boxManager ) {

        Game.arena.boxManager.update( delta );

    }

    for ( var i = 0, il = Game.arena.towerManager.towers.length; i < il; i ++ ) {

        Game.arena.towerManager.towers[ i ].update( delta );

    }

    //

    for ( var i = 0, il = this.decorations.length; i < il; i ++ ) {

        var decoration = this.decorations[ i ];
        var dx = decoration.position.x - this.camera.position.x;
        var dz = decoration.position.z - this.camera.position.z;

        if ( Math.sqrt( dx * dx + dz * dz ) < 100 ) {

            decoration.material[0].side = THREE.BackSide;
            decoration.material[0].transparent = true;
            decoration.material[0].opacity = 0.2;
            decoration.material[0].depthWrite = false;
            decoration.material[0].depthTest = false;
            decoration.renderOrder = 10;

        } else {

            decoration.material[0].side = THREE.FrontSide;
            decoration.material[0].transparent = false;
            decoration.material[0].opacity = 1;
            decoration.material[0].depthWrite = true;
            decoration.material[0].depthTest = true;
            decoration.renderOrder = 0;

        }

    }

    if ( Game.arena.me.moveDirection.x || Game.arena.me.moveDirection.y || Math.abs( controls.mousePos.x - controls.prevMousePos.x ) > 0.02 || Math.abs( controls.mousePos.y - controls.prevMousePos.y ) > 0.02 ) {

        var me = Game.arena.me;
        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( me.tank.object.top.matrixWorld );
        vector.project( view.camera );

        //

        if ( controls.prevMousePos.distanceTo( controls.mousePos ) > 0.01 ) {

            var angle = Math.atan2( - vector.y + controls.mousePos.y, - vector.x + controls.mousePos.x ) - Math.PI + me.rotation;

            if ( Math.abs( angle - me.topRotation ) > 0.003 ) {

                controls.rotateTop( angle );

            }

        }

    }

};
