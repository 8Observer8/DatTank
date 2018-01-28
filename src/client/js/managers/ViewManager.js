/*
 * @author ohmed
 * DatTank Scene Rendering core
*/

Game.ViewManager = function () {

    this.SCREEN_WIDTH = false;
    this.SCREEN_HEIGHT = false;

    this.prevRenderTime = false;

    //

    this.scene = false;
    this.camera = false;
    this.renderer = false;

    this.cameraOffset = new THREE.Vector3();
    this.shakeInterval = false;
    this.intersections = false;

    //

    this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 10000 );

};

Game.ViewManager.prototype = {};

//

Game.ViewManager.prototype.setupScene = function () {

    this.quality = 1;
    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;

    // setup camera and scene

    this.scene = new THREE.Scene();
    this.scene.intersections = [];
    this.camera = new THREE.PerspectiveCamera( 60, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, 1300 );

    this.sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.sun.position.set( 0, 100, 0 );
    this.sun.target = new THREE.Object3D();
    this.sun.target.position.set( 50, 0, 50 );
    this.scene.add ( this.sun );

    this.camera.position.set( 180, 400, 0 );
    this.camera.lookAt( new THREE.Vector3() );
    this.scene.add( this.camera );

    this.scene.fog = new THREE.FogExp2( 0xa9a6a6, 0.0024 );

    // setup sound listener

    if ( ! this.sound ) {

        this.sound = {};
        this.sound.listener = new THREE.AudioListener();
        this.camera.add( this.sound.listener );

    }

    // add light

    this.scene.add( new THREE.AmbientLight( 0xeeeeee ) );

    // user event handlers

    window.addEventListener( 'resize', this.resize.bind( this ) );

    this.updateRenderer();
    this.render();

    //

    console.log( '>Scene inited.' );

};

Game.ViewManager.prototype.addDecorations = function ( decorations ) {

    var tree = resourceManager.getModel( 'tree.json' );
    var tree1 = resourceManager.getModel( 'tree1.json' );
    var tree2 = resourceManager.getModel( 'tree2.json' );
    var tree3 = resourceManager.getModel( 'tree3.json' );
    var stone = resourceManager.getModel( 'stone.json' );
    var stone1 = resourceManager.getModel( 'stone1.json' );
    var stone2 = resourceManager.getModel( 'stone2.json' );
    var oldCastle = resourceManager.getModel( 'oldCastle.json' );

    var model;
    var mesh;
    var decoration;

    //

    for ( var i = 0, il = decorations.length; i < il; i ++ ) {

        decoration = decorations[ i ];

        switch ( decoration.type ) {

            case 'tree':
                model = tree;
                break;

            case 'tree1':
                model = tree1;
                break;

            case 'tree2':
                model = tree2;
                break;

            case 'tree3':
                model = tree3;
                break;

            case 'rock':
                model = stone;
                break;

            case 'rock1':
                model = stone1;
                break;

            case 'rock2':
                model = stone2;
                break;

            case 'oldCastle':
                model = oldCastle;
                break;

            default:
                console.log('No proper decoration model.');

        }

        mesh = new THREE.Mesh( model.geometry, model.material );
        mesh.scale.set( decoration.scale.x, decoration.scale.y, decoration.scale.z );
        mesh.rotation.y = Math.random() * Math.PI;

        var scale = Math.random() * 15;
        if ( decoration.type === 'tree' || decoration.type === 'tree1' || decoration.type === 'tree2' || decoration.type === 'tree3' ) {

            mesh.scale.y /= 1.7;

        }

        if ( decoration.type === 'oldCastle' ) {

            mesh.scale.set( 20, 20, 20 );

        }

        mesh.position.set( decoration.position.x, decoration.position.y, decoration.position.z );
        mesh.name = decoration.type;
        view.scene.add( mesh );

        this.addObjectShadow( decoration.type, mesh.position, mesh.scale, mesh.rotation );

        if ( decoration.type === 'rock2' ) {

            mesh.scale.set( 10 + scale, 10 + Math.random() * 5, 10 + scale );

        }

    }

};

Game.ViewManager.prototype.addMap = function () {

    var size = 2430;
    var offset = 100;
    var wallWidth = 30;

    var groundTexture = resourceManager.getTexture( 'Ground.jpg' );
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;

    if ( localStorage.getItem('hq') === 'true' ) {

        groundTexture.repeat.set( 60, 60 );

    } else {

        groundTexture.repeat.set( 50, 50 );

    }

    var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( size + 1800, size + 1800 ), new THREE.MeshBasicMaterial({ map: groundTexture, color: 0x555555 }) );
    ground.rotation.x = - Math.PI / 2;
    this.scene.add( ground );
    this.scene.ground = ground;

    ground.name = 'ground';
    this.ground = ground;

    // add grass

    for ( var i = 0; i < 50; i ++ ) {

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

    switch ( objectType ) {

        case 'tree':

            shadowScale = scale.y;
            shadowTexture = resourceManager.getTexture( 'treeshadow.png' );
            shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            shadowMesh.material.transparent = true;
            shadowMesh.rotation.x = - Math.PI / 2;
            shadowMesh.position.copy( position );
            shadowMesh.position.y += 0.5;
            shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
            shadowMesh.position.x += 2 * shadowMesh.scale.y / 2 - 2;
            shadowMesh.position.z += 2 * shadowMesh.scale.y / 2 - 4;
            shadowMesh.renderOrder = 2;
            this.scene.add( shadowMesh );

            break;

        case 'tree1':

            shadowScale = scale.y;
            shadowTexture = resourceManager.getTexture( 'treeshadow1.png' );
            shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            shadowMesh.material.transparent = true;
            shadowMesh.rotation.x = - Math.PI / 2;
            shadowMesh.position.copy( position );
            shadowMesh.position.y += 0.5;
            shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
            shadowMesh.position.x += 2 * shadowMesh.scale.y / 2 - 2;
            shadowMesh.position.z += 2 * shadowMesh.scale.y / 2 - 4;
            shadowMesh.renderOrder = 2;
            this.scene.add( shadowMesh );

            break;

        case 'tree2':

            shadowScale = scale.y;
            shadowTexture = resourceManager.getTexture( 'treeshadow2.png' );
            shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            shadowMesh.material.transparent = true;
            shadowMesh.rotation.x = - Math.PI / 2;
            shadowMesh.position.copy( position );
            shadowMesh.position.y += 0.5;
            shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
            shadowMesh.position.x += 2 * shadowMesh.scale.y / 2 - 2;
            shadowMesh.position.z += 2 * shadowMesh.scale.y / 2 - 4;
            shadowMesh.renderOrder = 2;
            this.scene.add( shadowMesh );

            break;

        case 'tree3':

            shadowScale = scale.y;
            shadowTexture = resourceManager.getTexture( 'treeshadow3.png' );
            shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            shadowMesh.material.transparent = true;
            shadowMesh.rotation.x = - Math.PI / 2;
            shadowMesh.position.copy( position );
            shadowMesh.position.y += 0.5;
            shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
            shadowMesh.position.x += 2 * shadowMesh.scale.y / 2 - 2;
            shadowMesh.position.z += 2 * shadowMesh.scale.y / 2 - 4;
            shadowMesh.renderOrder = 2;
            this.scene.add( shadowMesh );

            break;

        case 'rock':

            shadowScale = ( scale.x + scale.y + scale.z ) / 3;
            shadowTexture = resourceManager.getTexture( 'stoneshadow.png' );
            shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            shadowMesh.material.transparent = true;
            shadowMesh.rotation.x = - Math.PI / 2;
            shadowMesh.position.copy( position );
            shadowMesh.position.y += 0.5;
            shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
            shadowMesh.position.x += shadowMesh.scale.y / 2;
            shadowMesh.position.z += shadowMesh.scale.y / 2;
            shadowMesh.renderOrder = 2;
            this.scene.add( shadowMesh );

            break;

        case 'rock1':

            var rockShadowTexture1 = resourceManager.getTexture( 'stoneshadow_1.png' );
            var rockShadowTexture2 = resourceManager.getTexture( 'stoneshadow_2.png' );
            var rockShadowTexture3 = resourceManager.getTexture( 'stoneshadow_3.png' );
            var rockShadowTexture4 = resourceManager.getTexture( 'stoneshadow_4.png' );
            shadowScale = ( scale.x + scale.y + scale.z ) / 4;

            if ( rotation.y < 0.9 ) {

                shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 5, 5 ), new THREE.MeshBasicMaterial({ map: rockShadowTexture1, transparent: true, depthWrite: false, opacity: 0.4 }) );

            } else if ( rotation.y > 0.9 && rotation.y < 1.8 ) {

                shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 5, 5 ), new THREE.MeshBasicMaterial({ map: rockShadowTexture2, transparent: true, depthWrite: false, opacity: 0.4 }) );

            } else if ( rotation.y > 1.8 && rotation.y < 2.7 ) {

                shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 5, 5 ), new THREE.MeshBasicMaterial({ map: rockShadowTexture3, transparent: true, depthWrite: false, opacity: 0.4 }) );

            } else if ( rotation.y > 2.7 ) {

                shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 5, 5 ), new THREE.MeshBasicMaterial({ map: rockShadowTexture4, transparent: true, depthWrite: false, opacity: 0.4 }) );

            }

            shadowMesh.material.transparent = true;
            shadowMesh.rotation.x = - Math.PI / 2;
            shadowMesh.position.copy( position );
            shadowMesh.position.y += 0.5;
            shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
            shadowMesh.position.x += shadowMesh.scale.y / 4;
            shadowMesh.position.z += shadowMesh.scale.y / 4;
            shadowMesh.renderOrder = 2;
            this.scene.add( shadowMesh );

            break;

        case 'oldCastle':

            shadowScale = scale.y;
            shadowTexture = resourceManager.getTexture( 'shadowHouse.png' );
            shadowMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 6, 6 ), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            shadowMesh.material.transparent = true;
            shadowMesh.rotation.x = - Math.PI / 2;
            shadowMesh.position.copy( position );
            shadowMesh.position.y += 0.5;
            shadowMesh.scale.set( shadowScale, shadowScale, shadowScale );
            shadowMesh.position.x += 5 * shadowMesh.scale.y / 2 - 4;
            shadowMesh.position.z += 3 * shadowMesh.scale.y / 2 - 4;
            shadowMesh.renderOrder = 2;
            this.scene.add( shadowMesh );

            break;

        default:

    }

};

Game.ViewManager.prototype.addGrassZones = function () {

    var size = 2430;
    var grassTexture = resourceManager.getTexture( 'Grass.png' );
    var grass = new THREE.Mesh( new THREE.PlaneBufferGeometry( 240, 240 ), new THREE.MeshBasicMaterial({ map: grassTexture, color: 0x779977, transparent: true, depthWrite: false }) );
    grass.rotation.x = - Math.PI / 2;
    grass.rotation.z = Math.random() * Math.PI;
    var scale = Math.random() / 2 + 0.3;
    grass.scale.set( scale, scale, scale );
    grass.material.transparent = true;
    grass.position.set( ( Math.random() - 0.5 ) * size, 0.1 + Math.random() / 10, ( Math.random() - 0.5 ) * size );
    grass.renderOrder = 1;
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
        plane.renderOrder = 0;
        this.scene.add( plane );
        plane.name = 'team-spawn-plane-' + name;

    }

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

Game.ViewManager.prototype.updateRenderer = function () {

    var antialias = false;
    this.quality = 0.7;

    if ( localStorage.getItem('hq') === 'true' ) {

        antialias = true;
        this.quality = 1;

    }

    $('#renderport').remove();
    $('#viewport').prepend('<canvas id="renderport"></canvas>');
    this.renderer = new THREE.WebGLRenderer({ canvas: $('#renderport')[0], antialias: antialias });
    this.renderer.setSize( this.quality * this.SCREEN_WIDTH, this.quality * this.SCREEN_HEIGHT );
    this.renderer.setClearColor( 0xa9a6a6 );

};

Game.ViewManager.prototype.resize = function () {

    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;

    //

    this.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.quality * this.SCREEN_WIDTH, this.quality * this.SCREEN_HEIGHT );

};

Game.ViewManager.prototype.animate = function ( delta ) {

    if ( ! Game.arena ) return;

    // update camera position

    // + shake camera
    this.camera.position.x = Game.arena.me.position.x - ( 170 * Math.sin( Game.arena.me.rotation ) );
    this.camera.position.z = Game.arena.me.position.z - ( 170 * Math.cos( Game.arena.me.rotation ) );
    this.camera.position.y = 120;

    this.camera.position.set( this.camera.position.x + this.cameraOffset.x, this.camera.position.y + this.cameraOffset.y, this.camera.position.z + this.cameraOffset.z );

    var lookPos = new THREE.Vector3( Game.arena.me.position.x, Game.arena.me.position.y + 65, Game.arena.me.position.z );

    this.camera.lookAt( lookPos );

    if ( Game.arena.boxManager ) {

        Game.arena.boxManager.update( delta );

    }

    for ( var i = 0, il = Game.arena.towerManager.towers.length; i < il; i ++ ) {

        Game.arena.towerManager.towers[ i ].update( delta );

    }

    if ( ! this.intersections || Game.arena.me.moveDirection.x || Game.arena.me.moveDirection.y || Math.abs( controls.mousePos.x - controls.prevMousePos.x ) > 0.02 || Math.abs( controls.mousePos.y - controls.prevMousePos.y ) > 0.02 ) {

        view.raycaster.setFromCamera( controls.mousePos, view.camera );
        this.intersections = view.raycaster.intersectObjects( [ view.ground ] );

        if ( controls.prevMousePos.distanceTo( controls.mousePos ) > 0.05 ) {

            controls.prevMousePos.set( controls.mousePos.x, controls.mousePos.y );

            if ( this.intersections.length ) {

                var me = Game.arena.me;
                var angle = Math.atan2( this.intersections[0].point.x - me.position.x, this.intersections[0].point.z - me.position.z ) - Math.PI / 2;

                if ( Math.abs( angle - me.topRotation ) > 0.01 ) {

                    controls.rotateTop( angle );

                }

            }

        }

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

Game.ViewManager.prototype.render = function () {

    if ( ! this.prevRenderTime ) this.prevRenderTime = performance.now();

    var delta = performance.now() - this.prevRenderTime;
    this.prevRenderTime = performance.now();

    this.animate( delta );
    this.renderer.render( this.scene, this.camera );

    //

    requestAnimationFrame( this.render.bind( this ) );

};
