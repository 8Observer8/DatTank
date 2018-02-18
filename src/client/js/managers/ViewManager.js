/*
 * @author ohmed
 * DatTank Scene Rendering core
*/

Game.ViewManager = function () {

    this.screenWidth = false;
    this.screenHeight = false;

    this.prevRenderTime = false;

    //

    this.scene = false;
    this.camera = false;
    this.renderer = false;

    //

    this.quality = false;
    this.antialias = false;

    // scene params

    this.mapSize = 1270;
    this.fog = { color: 0xc4c4c2, density: 0.0025 };
    this.lights = {
        ambient:    0xfff3bc,
        sun:        {
            color:      0xfff3bc,
            intensity:  0.6,
            position:   new THREE.Vector3( 0, 100, 0 ),
            target:     new THREE.Vector3( 50, 0, 50 )
        }
    };

    //

    this.cameraOffset = new THREE.Vector3();
    this.shakeInterval = false;
    this.intersections = false;

    this.decorations = [];

    this.sound = {};

    //

    this.raycaster = false;

};

Game.ViewManager.prototype = {};

//

Game.ViewManager.prototype.setupScene = function () {

    this.quality = 1;
    this.antialias = true;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 5000 );

    // setup camera and scene

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 60, this.screenWidth / this.screenHeight, 1, 900 );
    this.scene.add( this.camera );

    // setup lights

    this.sun = new THREE.DirectionalLight( this.lights.sun.color, this.lights.sun.intensity );
    this.sun.position.copy( this.lights.sun.position );
    this.sun.target.position.set( this.lights.sun.target );
    this.scene.add ( this.sun );
    this.scene.add( new THREE.AmbientLight( this.lights.ambient ) );

    // add fog

    this.scene.fog = new THREE.FogExp2( this.fog.color, this.fog.density );

    // setup sound listener

    this.sound.listener = new THREE.AudioListener();
    if ( soundManager.muted ) this.sound.listener.setMasterVolume( 0 );
    this.camera.add( this.sound.listener );

    // start rendering

    this.updateRenderer();
    this.render();

    // user event handlers

    window.addEventListener( 'resize', this.resize.bind( this ) );

};

Game.ViewManager.prototype.addDecorations = function ( decorations ) {

    var model;
    var mesh;
    var decoration;

    //

    for ( var i = 0, il = decorations.length; i < il; i ++ ) {

        decoration = decorations[ i ];
        model = Game.arena.decorationManager.list[ decoration.type ].model;

        mesh = new THREE.Mesh( model.geometry, [ model.material[0].clone() ] );
        mesh.material[0].side = THREE.FrontSide;
        mesh.scale.set( decoration.scale.x, decoration.scale.y, decoration.scale.z );
        mesh.rotation.y = decoration.rotation;
        mesh.position.set( decoration.position.x, decoration.position.y, decoration.position.z );
        mesh.name = decoration.type;
        view.scene.add( mesh );
        this.decorations.push( mesh );

        this.addObjectShadow( decoration.type, mesh.position, mesh.scale, mesh.rotation );

    }

};

Game.ViewManager.prototype.addTerrain = function () {

    var size = 2430;
    var offset = 100;
    var wallWidth = 30;

    var groundTexture = resourceManager.getTexture( 'Ground.jpg' );
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 30, 30 );

    var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( size + 1800, size + 1800 ), new THREE.MeshBasicMaterial({ depthWrite: false, map: groundTexture, color: 0x777050 }) );
    ground.rotation.x = - Math.PI / 2;
    ground.renderOrder = 6;
    this.scene.add( ground );
    this.scene.ground = ground;

    ground.name = 'ground';
    this.ground = ground;

    // add grass

    for ( var i = 0; i < 150; i ++ ) {

        this.addGrassZones();

    }

    // add edges

    var edgeTexture = resourceManager.getTexture( 'brick.jpg' );
    edgeTexture.wrapS = THREE.RepeatWrapping;
    edgeTexture.wrapT = THREE.RepeatWrapping;
    edgeTexture.repeat.set( 50, 0.5 );
    var material = new THREE.MeshBasicMaterial({ color: 0x999999, map: edgeTexture });

    var border1 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset + wallWidth, wallWidth, wallWidth ), material );
    border1.rotation.y += Math.PI / 2;
    border1.position.set( size / 2 + offset, 1, 0 );
    this.scene.add( border1 );

    var border2 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset + wallWidth, wallWidth, wallWidth ), material );
    border2.rotation.y = - Math.PI / 2;
    border2.position.set( - size / 2 - offset, 1, 0 );
    this.scene.add( border2 );

    var border3 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset - wallWidth, wallWidth, wallWidth ), material );
    border3.position.set( 0, 1, size / 2 + offset );
    this.scene.add( border3 );

    var border4 = new THREE.Mesh( new THREE.BoxGeometry( size + 2 * offset - wallWidth, wallWidth, wallWidth ), material );
    border4.position.set( 0, 1, - size / 2 - offset );
    this.scene.add( border4 );

};

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

Game.ViewManager.prototype.addGrassZones = function () {

    var size = 2430;
    var scale = Math.random() / 2 + 0.3;
    var grassTexture = resourceManager.getTexture( 'Grass.png' );

    var grass = new THREE.Mesh( new THREE.PlaneBufferGeometry( 240, 240 ), new THREE.MeshBasicMaterial({ map: grassTexture, color: 0x779977, transparent: true, depthWrite: false }) );
    grass.rotation.set( - Math.PI / 2, 0, Math.random() * Math.PI );
    grass.scale.set( scale, scale, scale );
    grass.material.transparent = true;
    grass.position.set( ( Math.random() - 0.5 ) * size, 0.1 + Math.random() / 10, ( Math.random() - 0.5 ) * size );
    grass.renderOrder = 8;
    this.scene.add( grass );

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

Game.ViewManager.prototype.updateCamera = function () {

    this.camera.position.x = Game.arena.me.position.x - 150 * Math.sin( Game.arena.me.rotation ) + this.cameraOffset.x;
    this.camera.position.z = Game.arena.me.position.z - 150 * Math.cos( Game.arena.me.rotation ) + this.cameraOffset.y;
    this.camera.position.y = 110 + this.cameraOffset.z;
    this.camera.lookAtVector = this.camera.lookAtVector || new THREE.Vector3();
    this.camera.lookAtVector.set( Game.arena.me.position.x, Game.arena.me.position.y + 65, Game.arena.me.position.z );
    this.camera.lookAt( this.camera.lookAtVector );

};

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

    if ( ! this.intersections || Game.arena.me.moveDirection.x || Game.arena.me.moveDirection.y || Math.abs( controls.mousePos.x - controls.prevMousePos.x ) > 0.02 || Math.abs( controls.mousePos.y - controls.prevMousePos.y ) > 0.02 ) {

        view.raycaster.setFromCamera( controls.mousePos, view.camera );
        this.intersections = view.raycaster.intersectObjects( [ view.ground ] );

        if ( controls.prevMousePos.distanceTo( controls.mousePos ) > 0.01 ) {

            controls.prevMousePos.set( controls.mousePos.x, controls.mousePos.y );

            if ( this.intersections.length ) {

                var me = Game.arena.me;
                var angle = Math.atan2( this.intersections[0].point.x - me.position.x, this.intersections[0].point.z - me.position.z ) - Math.PI / 2;

                if ( Math.abs( angle - me.topRotation ) > 0.003 ) {

                    controls.rotateTop( angle );

                }

            }

        }

    }

};

Game.ViewManager.prototype.render = function () {

    if ( ! this.prevRenderTime ) this.prevRenderTime = performance.now();

    var delta = performance.now() - this.prevRenderTime;
    this.prevRenderTime = performance.now();

    this.animate( delta );
    this.renderer.render( this.scene, this.camera );

    //

    requestAnimationFrame( this.render.bind( this ) );

};

//

Game.ViewManager.prototype.resize = function () {

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    //

    this.camera.aspect = this.screenWidth / this.screenHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.quality * this.screenWidth, this.quality * this.screenHeight );

};

Game.ViewManager.prototype.updateRenderer = function () {

    if ( localStorage.getItem('hq') === 'true' ) {

        this.antialias = true;
        this.quality = 0.9;

    } else {

        this.antialias = false;
        this.quality = 0.7;

    }

    this.antialias = false;

    $('#renderport').remove();
    $('#viewport').prepend('<canvas id="renderport"></canvas>');
    this.renderer = new THREE.WebGLRenderer({ canvas: $('#renderport')[0], antialias: this.antialias });
    this.renderer.setSize( this.quality * this.screenWidth, this.quality * this.screenHeight );
    this.renderer.setClearColor( this.fog.color );

    controls.mouseInit();

};

Game.ViewManager.prototype.clean = function () {

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
