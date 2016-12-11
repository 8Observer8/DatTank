/*
 * @author ohmed
 * DatTank Scene Rendering core
*/

var MOBILE;

DT.View = function () {

    this.SCREEN_WIDTH = false;
    this.SCREEN_HEIGHT = false;

    //

    MOBILE = new MobileDetect( window.navigator.userAgent );
    MOBILE = MOBILE.mobile() || MOBILE.phone() || MOBILE.tablet();

    if ( MOBILE ) {

        $('.error-on-mobile').show();
        return;

    }

    //

    this.scene = false;
    this.camera = false;
    this.renderer = false;

    this.selectionCircle = false;

    this.cameraOffset = new THREE.Vector3();
    this.shakeInterval = false;

    //

    this.stats = false;

    //

    this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 10000 );

    //

    var scope = this;

    this.gameLoopInterval = setInterval( function () {

        scope.updatePlayersPosition( 20 );
        scope.updatePlayersTopRotation( 20 );

    }, 20 );

};

DT.View.prototype = {};

DT.View.prototype.setupScene = function () {

    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;

    // setup camera and scene

    this.scene = new THREE.Scene();
    this.scene.intersections = [];
    this.camera = new THREE.PerspectiveCamera( 60, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, 10000 );

    this.camera.position.set( 180, 400, 0 );
    this.camera.lookAt( new THREE.Vector3() );

    this.scene.add( this.camera );

    this.scene.fog = new THREE.Fog( 0x050303, 350, 1900 );

    // setup sound listener

    if ( ! this.sound ) {
    
        this.sound = {};
        this.sound.listener = new THREE.AudioListener();
        this.camera.add( this.sound.listener );

    }

    // add light

    this.scene.add( new THREE.AmbientLight( 0x444444 ) );
    this.sunLight = new THREE.DirectionalLight( 0xaaaaaa, 2 );
    this.sunLight.position.set( -30, 250, 30 );  
    var target = new THREE.Object3D();
    target.position.set( 0, 0, 0 );
    this.sunLight.target = target;
    this.scene.add( this.sunLight );

    this.sunLight.castShadow = true;

    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;

    this.sunLight.shadow.camera.right    =  1000;
    this.sunLight.shadow.camera.left     = -1000;
    this.sunLight.shadow.camera.top      =  1000;
    this.sunLight.shadow.camera.bottom   = -1000;
    this.sunLight.shadow.camera.far      = 6000;

    // add stats

    var container;

    container = document.createElement('div');
    document.body.appendChild( container );

    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    stats.domElement.style.display = 'none';
    stats.domElement.style['z-index'] = 1000;
    stats.domElement.style.zIndex = 1000;
    document.body.appendChild( stats.domElement );

    this.stats = stats;

    // user event handlers

    window.addEventListener( 'resize', this.resize.bind( this ) );

    // setup renderer

    var antialias = false;
    var quality = 0.7;

    if ( localStorage.getItem('hq') === 'true' ) {

        antialias = true;
        quality = 1;

    }

    if ( ! this.renderer ) {

        this.renderer = new THREE.WebGLRenderer({ canvas: Utils.ge('#renderport'), antialias: antialias });
        this.renderer.setSize( quality * this.SCREEN_WIDTH, quality * this.SCREEN_HEIGHT );
        this.renderer.setClearColor( 0x000000 );

        if ( ! MOBILE ) {
        
            // this.renderer.shadowMap.enabled = true;

        }

        this.render();

    }

    //

    console.log( '>Scene inited.' );

};

DT.View.prototype.addObsticles = function ( obstacles ) {

    var tree = resourceManager.getModel( 'tree.json' );
    tree.material[0].alphaTest = 0.5;

    var stone = resourceManager.getModel( 'stone.json' );
    var model;
    var mesh;
    var obstacle;

    var placingObjects = [];

    for ( var i = 0, il = obstacles.length; i < il; i ++ ) {

        obstacle = obstacles[ i ];

        if ( obstacle.type === 'tree' ) {

            model = tree;
            var sizeX = 1.5 * obstacle.scale.x;
            var sizeZ = 1.5 * obstacle.scale.z;
            var texturesOffset = 0;

        }

        if ( obstacle.type === 'rock' ) {

            model = stone;
            var sizeX = 2.4 * obstacle.scale.x;
            var sizeZ = 2.4 * obstacle.scale.z;
            var texturesOffset = 2;

        }

        mesh = new THREE.Mesh( model.geometry, new THREE.MultiMaterial( model.material ) );
        mesh.scale.set( obstacle.scale.x, obstacle.scale.y, obstacle.scale.z );
        mesh.castShadow = true;
        mesh.position.set( obstacle.position.x, obstacle.position.y, obstacle.position.z );
        mesh.name = obstacle.type;
        view.scene.add( mesh );
        view.scene.intersections.push( mesh );

        placingObjects.push( [ new THREE.Vector3( mesh.position.x - sizeX / 2, 0, mesh.position.z - sizeZ / 2 ), new THREE.Vector3( mesh.position.x + sizeX / 2, 0, mesh.position.z + sizeZ / 2 ) ] );

    }

    DT.arena.pathFinder.placeObjects( placingObjects );
    
    setTimeout( DT.arena.pathFinder.constructMap.bind( DT.arena.pathFinder ), 1000 );

};

DT.View.prototype.addMap = function () {

    var groundTexture = resourceManager.getTexture( 'Ground.jpg' );
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 10, 10 );

    var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshLambertMaterial({ map: groundTexture, color: 0x555555 }) );
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add( ground );
    this.scene.ground = ground;

    ground.name = 'ground';
    this.ground = ground;

    var size = 2030;

    var edgeTexture = resourceManager.getTexture( 'brick.jpg' );
    edgeTexture.wrapS = THREE.RepeatWrapping;
    edgeTexture.wrapT = THREE.RepeatWrapping;
    edgeTexture.repeat.set( 100, 1 );
    var material = new THREE.MeshLambertMaterial({ color: 0x999999, map: edgeTexture });

    var border1 = new THREE.Mesh( new THREE.BoxGeometry ( size + 30, 30, 30), material );
    border1.receiveShadow = true;
    border1.rotation.y += Math.PI / 2;
    border1.position.set( size / 2, 1, 0 );
    this.scene.add( border1 );

    var border2 = new THREE.Mesh( new THREE.BoxGeometry ( size + 30, 30, 30 ), material );
    border2.receiveShadow = true;
    border2.rotation.y = - Math.PI / 2;
    border2.position.set( - size / 2, 1, 0 );
    this.scene.add( border2 );

    var border3 = new THREE.Mesh( new THREE.BoxGeometry ( size + 30, 30, 30 ), material );
    border3.receiveShadow = true;
    border3.position.set( 0, 1, size / 2 );
    this.scene.add( border3 );

    var border4 = new THREE.Mesh( new THREE.BoxGeometry ( size + 30, 30, 30 ), material );
    border4.receiveShadow = true;
    border4.position.set( 0, 1, - size / 2 );
    this.scene.add( border4 );

};

DT.View.prototype.addTeamZone = function () {

    var zone1 = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshLambertMaterial({ color: 0xff0000, transparent: true }) );
    zone1.rotation.x = - Math.PI / 2;
    zone1.receiveShadow = true;
    zone1.material.opacity = 0.2;
    zone1.position.set( 500, 1, 500 );
    this.scene.add( zone1 );
    zone1.name = 'zone1';

    var zone2 = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshLambertMaterial({ color: 0x008000, transparent: true }) );
    zone2.rotation.x = - Math.PI / 2;
    zone2.receiveShadow = true;
    zone2.material.opacity = 0.2;
    zone2.position.set( -500, 1, 500 );
    this.scene.add( zone2 );
    zone2.name = 'zone2';

    var zone3 = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshLambertMaterial({ color: 0x0000ff, transparent: true }) );
    zone3.rotation.x = - Math.PI / 2;
    zone3.receiveShadow =true;
    zone3.material.opacity = 0.2;
    zone3.position.set( 500, 1, -500 );
    this.scene.add( zone3 );
    zone3.name = 'zone3';

    var zone4 = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshLambertMaterial({ color: 0xffa500, transparent: true }) );
    zone4.rotation.x = - Math.PI / 2;
    zone4.receiveShadow = true;
    zone4.material.opacity = 0.2;
    zone4.position.set( -500, 1, -500);
    this.scene.add( zone4 );
    zone4.name = 'zone4';

};

DT.View.prototype.clean = function () {

    if ( this.scene ) {

        this.camera.position.y = 400;

        for ( var i = 0, il = this.scene.children.length; i < il; i ++ ) {

            if ( this.shakeInterval !== false ) {

                clearInterval( this.shakeInterval );
                this.shakeInterval = false;

            }

            this.cameraOffset.set( 0, 0, 0 );
            this.scene.remove( this.scene.children[ i ] );

        }

    }

};

DT.View.prototype.resize = function () {

    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;

    //

    this.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.SCREEN_WIDTH, this.SCREEN_HEIGHT );

};

DT.View.prototype.showDestinationPoint = (function() {

    var interval;

    return function ( position ) {

        var scope = this;
        clearInterval( interval );

        if ( ! this.selectionCircle ) {

            this.selectionCircle = new THREE.Mesh( new THREE.PlaneGeometry( 1.8, 1.8 ), new THREE.MeshBasicMaterial({ transparent: true, map: resourceManager.getTexture( 'SelectionSprite.png' ) }) );
            this.selectionCircle.rotation.x = - Math.PI / 2;
            this.scene.add( this.selectionCircle );

        }

        this.selectionCircle.position.set( position.x, 1, position.z );
        this.selectionCircle.scale.set( 10, 10, 10 );
        this.selectionCircle.material.opacity = 1;

        var iter = 100;

        interval = setInterval( function () {

            scope.selectionCircle.scale.set( iter / 10, iter / 10, iter / 10 );
            scope.selectionCircle.material.opacity = iter / 100;

            iter -= 2;

            if ( iter === 0 ) {

                clearInterval( interval );

            }

        }, 16 );

    };

}) ();

var intersections = false;

DT.View.prototype.animate = function ( delta ) {

    if ( ! DT.arena ) return;

    // update camera position

    this.camera.position.set( DT.arena.me.position.x + 180 + this.cameraOffset.x, this.camera.position.y + this.cameraOffset.y, DT.arena.me.position.z + this.cameraOffset.z );
    this.camera.lookAt( DT.arena.me.position );

    this.sunLight.position.set( DT.arena.me.position.x - 100, this.sunLight.position.y, DT.arena.me.position.z + 100 );

    //

    if ( DT.arena.boxManager ) {

        DT.arena.boxManager.update( delta );

    }

    for ( var i = 0, il = DT.arena.towers.length; i < il; i ++ ) {

        DT.arena.towers[ i ].update( delta );

    }

    if ( ! intersections || DT.arena.me.movePath.length || Math.abs( controls.mousePos.x - controls.prevMousePos.x ) > 0.02 || Math.abs( controls.mousePos.y - controls.prevMousePos.y ) > 0.02 ) {

        view.raycaster.setFromCamera( controls.mousePos, view.camera );
        intersections = view.raycaster.intersectObjects( [ view.ground ] );

        controls.prevMousePos.set( controls.mousePos.x, controls.mousePos.y );

        if ( intersections.length ) {

            var me = DT.arena.me;
            var angle = Math.atan2( intersections[0].point.x - me.position.x, intersections[0].point.z - me.position.z ) - Math.PI / 2;
            
            if ( Math.abs( angle - me.topRotation ) > 0.03 ) {

                me.rotateTop( angle );

            }

        }

    }

};

DT.View.prototype.updatePlayersTopRotation = function ( delta ) {

    if ( ! DT.arena ) return;

    // for ( var i = 0, il = DT.arena.players.length; i < il; i ++ ) {

    //     var player = DT.arena.players[ i ];

    //     if ( Math.abs( player.rotationTopTarget - player.object.top.rotation.y ) > 0.1 ) {

    //         if ( Math.abs( player.rotationTopTarget - ( player.object.top.rotation.y + ( player.rotDelta / 3 ) * ( delta / 16 ) ) ) > Math.abs( player.rotationTopTarget - player.object.top.rotation.y ) ) {

    //             player.object.top.rotation.y = player.rotationTopTarget;
    //             player.topRotation = player.object.top.rotation.y;
    //             return;

    //         }

    //         player.object.top.rotation.y += ( player.rotDelta / 3 ) * ( delta / 16 );
    //         player.topRotation = player.object.top.rotation.y;

    //     }

    // }

};

DT.View.prototype.updatePlayersPosition = function ( delta ) {

    if ( ! DT.arena ) return;

    var time = Date.now();
    var abs = Math.abs;

    for ( var i = 0, il = DT.arena.players.length; i < il; i ++ ) {

        var player = DT.arena.players[ i ];
        var tank = player.tank;

        player.tank.update( delta );

        if ( ! player.movePath || player.movePath.length === 0 ) {

            player.movePath = false;

            if ( tank.sounds.moving.source.buffer && tank.sounds.moving.isPlaying ) {

                tank.sounds.moving.stop();
                tank.sounds.moving.startTime = 0;
                tank.sounds.moving.isPlaying = false;

            }

            continue;

        }

        //

        var progress = player.movementDurationMap.length - 1;

        for ( var j = 0, jl = player.movementDurationMap.length; j < jl; j ++ ) {

            if ( time - player.movementStart > player.movementDurationMap[ j ] ) {

                progress --;

            } else {

                break;

            }

        }

        if ( progress < 0 ) {

            player.movePath = false;

            if ( tank.sounds.moving.source.buffer && tank.sounds.moving.isPlaying ) {

                tank.sounds.moving.stop();
                tank.sounds.moving.startTime = false;
                tank.sounds.moving.isPlaying = false;

            }

            continue;

        } else {

            if ( localStorage.getItem('sound') !== 'false' && tank.sounds.moving.source.buffer && ! tank.sounds.moving.isPlaying ) {

                tank.sounds.moving.play();

            }

            if ( progress !== player.moveProgress ) {

                // changing path point & counting delta

                var dx, dz;
                var dxr, dzr;

                if ( player.movePath[ 2 * ( progress - 30 ) ] ) {

                    dxr = ( player.movePath[ 2 * ( progress - 30 ) + 0 ] + player.movePath[ 2 * ( progress - 29 ) + 0 ] + player.movePath[ 2 * ( progress - 28 ) + 0 ] ) / 3 - player.position.x;
                    dzr = ( player.movePath[ 2 * ( progress - 30 ) + 1 ] + player.movePath[ 2 * ( progress - 29 ) + 1 ] + player.movePath[ 2 * ( progress - 28 ) + 1 ] ) / 3 - player.position.z;

                } else {

                    dxr = player.movePath[ 2 * progress + 0 ] - player.position.x;
                    dzr = player.movePath[ 2 * progress + 1 ] - player.position.z;

                }

                dx = player.stepDx = player.movePath[ 2 * progress + 0 ] - player.position.x;
                dz = player.stepDz = player.movePath[ 2 * progress + 1 ] - player.position.z;

                player.moveDt = Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dz, 2 ) ) / player.moveSpeed;

                // count new player angle when moving

                player.newRotation = ( dzr === 0 && dxr !== 0 ) ? ( Math.PI / 2 ) * Math.abs( dxr ) / dxr : Math.atan2( dxr, dzr );
                player.newRotation = Utils.formatAngle( player.newRotation );
                player.dRotation = ( player.newRotation - player.rotation );

                if ( isNaN( player.dRotation ) ) player.dRotation = 0;

                if ( player.dRotation > Math.PI ) {

                    player.dRotation -= 2 * Math.PI;

                }

                if ( player.dRotation < - Math.PI ) {

                    player.dRotation += 2 * Math.PI;

                }

                player.dRotation /= 20;
                player.dRotCount = 20;

                player.moveProgress = progress;

            }

            //

            if ( player.dRotCount > 0 ) {

                player.rotation = Utils.addAngle( player.rotation, player.dRotation );
                player.tank.setRotation( player.rotation );

                player.dRotCount --;

            }

            // making transition movement between path points

            var dx = delta * player.stepDx / player.moveDt;
            var dz = delta * player.stepDz / player.moveDt;

            if ( abs( dx ) <= abs( player.stepDx ) && abs( dz ) <= abs( player.stepDz ) ) {

                player.position.x += dx;
                player.position.z += dz;

                player.tank.setPosition( player.position.x, player.position.y, player.position.z );

            }

        }

    }

};

DT.View.prototype.changeGraficQuality = function () {

    var antialias = false;
    var quality = 0.7;

    if ( localStorage.getItem('hq') === 'true' ) {

        antialias = true;
        quality = 1;

    }

    if ( ! this.renderer ) {

        this.renderer = new THREE.WebGLRenderer({ canvas: Utils.ge('#renderport'), antialias: antialias });
        this.renderer.setSize( quality * this.SCREEN_WIDTH, quality * this.SCREEN_HEIGHT );
        this.renderer.setClearColor( 0x000000 );

        if ( ! MOBILE ) {

            // this.renderer.shadowMap.enabled = true;

        }

        this.render();

    }

};

DT.View.prototype.addCameraShake = function ( duration, intencity ) {

    var iter = 0;
    var scope = this;

    if ( this.shakeInterval !== false ) {
    
        clearInterval( this.shakeInterval );
        this.cameraOffset.set( 0, 0, 0 );

    }

    this.shakeInterval = setInterval( function () {

        scope.cameraOffset.x = intencity * ( Math.random() - 0.5 ) * iter / 2;
        scope.cameraOffset.y = intencity * ( Math.random() - 0.5 ) * iter / 2;
        scope.cameraOffset.z = intencity * ( Math.random() - 0.5 ) * iter / 2;

        iter ++;

        if ( iter > Math.floor( ( duration - 100 ) / 40 ) ) {

            clearInterval( scope.shakeInterval );
            scope.cameraOffset.set( 0, 0, 0 );
            scope.shakeInterval = false;

        }

    }, 40 );

};

DT.View.prototype.render = (function () {

    var prevRenderTime;

    return function () {

        if ( ! prevRenderTime ) prevRenderTime = performance.now();

        var delta = performance.now() - prevRenderTime;
        prevRenderTime = performance.now();

        //

        this.stats.update();

        view.sunLight.target.updateMatrixWorld();

        this.animate( delta );

        this.renderer.render( this.scene, this.camera );

        //

        requestAnimationFrame( this.render.bind( this ) );

    };

}) ();
