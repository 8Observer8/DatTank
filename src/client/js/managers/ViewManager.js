/*
 * @author ohmed
 * DatTank Scene Rendering core
*/

var MOBILE;

Game.ViewManager = function () {

    this.SCREEN_WIDTH = false;
    this.SCREEN_HEIGHT = false;

    this.prevRenderTime = false;

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

    this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 10000 );

};

Game.ViewManager.prototype = {};

Game.ViewManager.prototype.setupScene = function () {

    this.quality = 1;
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
    tree.material[0].alphaTest = 0.5;

    var tree1 = resourceManager.getModel( 'tree1.json' );
    tree1.material[0].alphaTest = 0.5;

    var tree2 = resourceManager.getModel( 'tree2.json' );
    tree1.material[0].alphaTest = 0.5;

    var tree3 = resourceManager.getModel( 'tree3.json' );
    tree1.material[0].alphaTest = 0.5;

    var stone = resourceManager.getModel( 'stone.json' );
    var stone1 = resourceManager.getModel( 'stone1.json' );
    var stone2 = resourceManager.getModel( 'stone2.json' );

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

            default:
                console.log('No proper decoration model.');

        }

        mesh = new THREE.Mesh( model.geometry, new THREE.MultiMaterial( model.material ) );

        var bbox = new THREE.Box3().setFromObject( mesh );
        var radius = Math.max( Math.abs( bbox.min.x ), Math.abs( bbox.min.z ), Math.abs( bbox.max.x ), Math.abs( bbox.max.z ) ) / 1.2;

        mesh.scale.set( decoration.scale.x, decoration.scale.y, decoration.scale.z );
        mesh.rotation.y = Math.random() * Math.PI;

        var scale = Math.random() * 10;
        if ( decoration.type === 'tree' || decoration.type === 'tree1' || decoration.type === 'tree2' || decoration.type === 'tree3' ) mesh.scale.set( 20 + scale, 10 + Math.random() * 20, 20 + scale );

        mesh.position.set( decoration.position.x, decoration.position.y, decoration.position.z );
        mesh.name = decoration.type;

        this.addObjectShadow( decoration.type, mesh.position, mesh.scale, mesh.rotation );

        var box = new THREE.Mesh( new THREE.SphereGeometry( radius, 32, 32 ), new THREE.MeshBasicMaterial(/*{ transparent: true, opacity: 0.2 }*/) );
        box.position.copy( mesh.position );
        box.rotation.copy( mesh.rotation );
        box.scale.copy( mesh.scale );
        box.scale.y *= 1.5;

        box.position.y += 15;
        box.material.visible = false;

        view.scene.add( mesh );
        view.scene.add( box );
        view.scene.intersections.push( box );

        if ( decoration.type === 'rock2' ) {

            view.scene.remove( box );
            mesh.scale.set( 10 + scale, 10 + Math.random() * 5, 10 + scale);

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

    for ( var i = 0; i < 20; i ++ ) {

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

    switch ( objectType ) {

        case 'tree':

            var treeShadowTexture = resourceManager.getTexture( 'treeshadow.png' );
            var treeShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: treeShadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            treeShadow.material.transparent = true;
            treeShadow.rotation.x = - Math.PI / 2;
            treeShadow.position.copy( position );
            treeShadow.position.y += 0.5;
            treeShadow.scale.set( scale.y, scale.y, scale.y );
            treeShadow.position.x += 2 * treeShadow.scale.y / 2 - 2;
            treeShadow.position.z += 2 * treeShadow.scale.y / 2 - 4;
            this.scene.add( treeShadow );

            break;

        case 'tree1':

            var treeShadowTexture = resourceManager.getTexture( 'treeshadow1.png' );
            var treeShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: treeShadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            treeShadow.material.transparent = true;
            treeShadow.rotation.x = - Math.PI / 2;
            treeShadow.position.copy( position );
            treeShadow.position.y += 0.5;
            treeShadow.scale.set( scale.y, scale.y, scale.y );
            treeShadow.position.x += 2 * treeShadow.scale.y / 2 - 2;
            treeShadow.position.z += 2 * treeShadow.scale.y / 2 - 4;
            this.scene.add( treeShadow );

            break;

        case 'tree2':

            var treeShadowTexture = resourceManager.getTexture( 'treeshadow2.png' );
            var treeShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: treeShadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            treeShadow.material.transparent = true;
            treeShadow.rotation.x = - Math.PI / 2;
            treeShadow.position.copy( position );
            treeShadow.position.y += 0.5;
            treeShadow.scale.set( scale.y, scale.y, scale.y );
            treeShadow.position.x += 2 * treeShadow.scale.y / 2 - 2;
            treeShadow.position.z += 2 * treeShadow.scale.y / 2 - 4;
            this.scene.add( treeShadow );

            break;

        case 'tree3':

            var treeShadowTexture = resourceManager.getTexture( 'treeshadow3.png' );
            var treeShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map: treeShadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) );
            treeShadow.material.transparent = true;
            treeShadow.rotation.x = - Math.PI / 2;
            treeShadow.position.copy( position );
            treeShadow.position.y += 0.5;
            treeShadow.scale.set( scale.y, scale.y, scale.y );
            treeShadow.position.x += 2 * treeShadow.scale.y / 2 - 2;
            treeShadow.position.z += 2 * treeShadow.scale.y / 2 - 4;
            this.scene.add( treeShadow );

            break;

        case 'rock':

            var rockShadowTexture = resourceManager.getTexture( 'stoneshadow.png' );
            var rockShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 3 ), new THREE.MeshBasicMaterial({ map: rockShadowTexture, transparent: true, depthWrite: false, opacity: 0.4 }) ); 
            rockShadow.material.transparent = true;
            rockShadow.rotation.x = - Math.PI / 2;
            rockShadow.position.copy( position );
            rockShadow.position.y += 0.5;
            var scale = ( scale.x + scale.y + scale.z ) / 3;
            rockShadow.scale.set( scale, scale, scale );
            rockShadow.position.x += rockShadow.scale.y / 2;
            rockShadow.position.z += rockShadow.scale.y / 2;
            this.scene.add( rockShadow );

            break;

        case 'rock1':

            var rockShadowTexture1 = resourceManager.getTexture( 'stoneshadow_1.png' );
            var rockShadowTexture2 = resourceManager.getTexture( 'stoneshadow_2.png' );
            var rockShadowTexture3 = resourceManager.getTexture( 'stoneshadow_3.png' );
            var rockShadowTexture4 = resourceManager.getTexture( 'stoneshadow_4.png' );

            if ( rotation.y < 0.9 ) {

                var rockShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 5, 5 ), new THREE.MeshBasicMaterial({ map: rockShadowTexture1, transparent: true, depthWrite: false, opacity: 0.4 }) );

            } else if ( rotation.y > 0.9 && rotation.y < 1.8 ) {

                var rockShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 5, 5 ), new THREE.MeshBasicMaterial({ map: rockShadowTexture2, transparent: true, depthWrite: false, opacity: 0.4 }) );

            } else if ( rotation.y > 1.8 && rotation.y < 2.7 ) {

                var rockShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 5, 5 ), new THREE.MeshBasicMaterial({ map: rockShadowTexture3, transparent: true, depthWrite: false, opacity: 0.4 }) );

            } else if ( rotation.y > 2.7 ) {

                var rockShadow = new THREE.Mesh( new THREE.PlaneBufferGeometry( 5, 5 ), new THREE.MeshBasicMaterial({ map: rockShadowTexture4, transparent: true, depthWrite: false, opacity: 0.4 }) );

            }
            
            rockShadow.material.transparent = true;
            rockShadow.rotation.x = - Math.PI / 2;
            rockShadow.position.copy( position );
            rockShadow.position.y += 0.5;
            var scale = ( scale.x + scale.y + scale.z ) / 4;
            rockShadow.scale.set( scale, scale, scale );
            rockShadow.position.x += rockShadow.scale.y / 4;
            rockShadow.position.z += rockShadow.scale.y / 4;
            this.scene.add( rockShadow );

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
    var scale = Math.random() / 2 + 0.8;
    grass.scale.set( scale, scale, scale );
    grass.material.transparent = true;
    grass.position.set( ( Math.random() - 0.5 ) * size, 0.1 + Math.random() / 10, ( Math.random() - 0.5 ) * size );
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

        plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshBasicMaterial({ map: baseTexture, color: color, transparent: true, opacity: 0.9, depthWrite: false }) );

        plane.material.color.r = plane.material.color.r / 2 + 0.25;
        plane.material.color.g = plane.material.color.g / 2 + 0.25;
        plane.material.color.b = plane.material.color.b / 2 + 0.25;

        plane.rotation.x = - Math.PI / 2;
        plane.position.set( x, 2, z );
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

    this.renderer = new THREE.WebGLRenderer({ canvas: Utils.ge('#renderport'), antialias: antialias });
    this.renderer.setSize( this.quality * this.SCREEN_WIDTH, this.quality * this.SCREEN_HEIGHT );
    this.renderer.setClearColor( 0x000000 );

};

Game.ViewManager.prototype.resize = function () {

    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;

    //

    this.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.quality * this.SCREEN_WIDTH, this.quality * this.SCREEN_HEIGHT );

};

Game.ViewManager.prototype.showDestinationPoint = (function() {

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

Game.ViewManager.prototype.animate = function ( delta ) {

    if ( ! Game.arena ) return;

    // update camera position

    this.camera.position.set( Game.arena.me.position.x + 180 + this.cameraOffset.x, this.camera.position.y + this.cameraOffset.y, Game.arena.me.position.z + this.cameraOffset.z );
    this.camera.lookAt( Game.arena.me.position );

    //

    if ( Game.arena.boxManager ) {

        Game.arena.boxManager.update( delta );

    }

    for ( var i = 0, il = Game.arena.towerManager.towers.length; i < il; i ++ ) {

        Game.arena.towerManager.towers[ i ].update( delta );

    }

    if ( ! intersections || Game.arena.me.moveDirection.x || Game.arena.me.moveDirection.y || Math.abs( controls.mousePos.x - controls.prevMousePos.x ) > 0.02 || Math.abs( controls.mousePos.y - controls.prevMousePos.y ) > 0.02 ) {

        view.raycaster.setFromCamera( controls.mousePos, view.camera );
        intersections = view.raycaster.intersectObjects( [ view.ground ] );

        controls.prevMousePos.set( controls.mousePos.x, controls.mousePos.y );

        if ( intersections.length ) {

            var me = Game.arena.me;
            var angle = Math.atan2( intersections[0].point.x - me.position.x, intersections[0].point.z - me.position.z ) - Math.PI / 2;

            if ( Math.abs( angle - me.topRotation ) > 0.03 ) {

                controls.rotateTop( angle );

            }

        }

    }

};

Game.ViewManager.prototype.changeGraficQuality = function () {

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

        this.render();

    }

};

Game.ViewManager.prototype.addCameraShake = function ( duration, intencity ) {

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

Game.ViewManager.prototype.render = function () {

    if ( ! this.prevRenderTime ) this.prevRenderTime = performance.now();

    var delta = performance.now() - this.prevRenderTime;
    this.prevRenderTime = performance.now();

    this.animate( delta );

    this.renderer.render( this.scene, this.camera );

    //

    requestAnimationFrame( this.render.bind( this ) );

};
