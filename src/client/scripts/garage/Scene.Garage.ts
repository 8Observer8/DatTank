/*
 * @author ohmed
 * DatTank Garage scene
*/

import * as THREE from 'three';

//

class GarageScene {

    private container;
    private scene;
    private camera;
    private renderer;

    private garage;

    private models: Array<any> = [];
    private currentTankModel;

    private ambientlight: THREE.AmbientLight;
    private spotLight: THREE.SpotLight;

    private timer: number = 0;
    private lastFrameTime: number = 0;
    private tankRotationSpeed: number = 0.00015;

    public background: number = 0x000000;

    public width: number = 0;
    public height: number = 0;

    //

    public init ( garage ) {

        this.garage = garage;

        // construct scene & renderer

        this.container = $('#garage-viewport')[0];
        this.width = $('#garage-viewport').parent().innerWidth();
        this.height = $('#garage-viewport').parent().innerHeight();

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( this.background, 0.035 );

        this.camera = new THREE.PerspectiveCamera( 50, this.width / this.height, 1, 2000 );
        this.camera.position.set( 2, 4, 5 );

        this.renderer = new THREE.WebGLRenderer({ canvas: this.container, antialias: true });
        this.renderer.setSize( this.width, this.height );
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        // construct lights

        this.ambientlight = new THREE.AmbientLight( 0xaaaaaa );
        this.scene.add( this.ambientlight );

        this.spotLight = new THREE.SpotLight( 0x888888, 1, 30, Math.PI / 4, 0.8 );
        this.spotLight.position.set( 2, 7, 2 );
        this.spotLight.lookAt( this.scene.position );
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 512;
        this.spotLight.shadow.mapSize.height = 512;
        this.spotLight.shadow.bias = - 0.001;
        this.scene.add( this.spotLight );

        //

        window.addEventListener( 'resize', this.resize.bind( this ) );
        this.render = this.render.bind( this );

        //

        this.loadModels();
        this.resize();
        this.render();

    };

    private loadModels () {

        let scope = this;
        let loader = new THREE.JSONLoader();
        let loaded = 0;
        let totalToLoad = 5;

        //

        function loadedCallback () {

            loaded ++;

            if ( loaded === totalToLoad ) {

                scope.garage.onLoadedResources();

            }

        };

        loader.load( 'resources/models/garage-IS2.json', function ( geometry, materials ) {

            var model = new THREE.Mesh( geometry, materials );
            model.position.y += 0.4;
            model.visible = true;
            model.castShadow = true;
            model.receiveShadow = true;
            model.scale.set( 0.8, 0.8, 0.8 );

            scope.scene.add( model );
            scope.models['IS2'] = model;

            loadedCallback();

        });

        loader.load( 'resources/models/garage-T29.json', function ( geometry, materials ) {

            var model = new THREE.Mesh( geometry, materials );
            model.position.y += 0.4;
            model.visible = true;
            model.castShadow = true;
            model.receiveShadow = true;
            model.scale.set( 0.8, 0.8, 0.8 );

            scope.scene.add( model );
            scope.models['T29'] = model;

            loadedCallback();

        });

        loader.load( 'resources/models/garage-T44.json', function ( geometry, materials ) {

            var model = new THREE.Mesh( geometry, materials );
            model.position.y += 0.4;
            model.visible = true;
            model.castShadow = true;
            model.receiveShadow = true;
            model.scale.set( 0.8, 0.8, 0.8 );

            scope.scene.add( model );
            scope.models['T44'] = model;

            loadedCallback();

        });

        loader.load( 'resources/models/garage-T54.json', function ( geometry, materials ) {

            var model = new THREE.Mesh( geometry, materials );
            model.position.y += 0.4;
            model.visible = true;
            model.castShadow = true;
            model.receiveShadow = true;
            model.scale.set( 0.8, 0.8, 0.8 );

            scope.scene.add( model );
            scope.models['T54'] = model;

            loadedCallback();

        });

        loader.load( 'resources/models/garage.json', function ( geometry, materials ) {

            var model = new THREE.Mesh( geometry, materials );
            model.castShadow = true;
            model.receiveShadow = true;
            model.position.y += 0.4;
            scope.scene.add( model );

            loadedCallback();

        });

    };

    public selectModel ( modelName: string ) {

        for ( var model in this.models ) {

            this.models[ model ].visible = false;

        }

        this.models[ modelName ].visible = true;
        this.currentTankModel = this.models[ modelName ];

    };

    public reset () {

        this.camera.position.set( Math.cos( this.timer * this.tankRotationSpeed ) * 10, 4, Math.sin( this.timer * this.tankRotationSpeed ) * 10 );
        this.camera.lookAt( this.scene.position );

    };

    public resize ( event? ) {

        this.width = $('#garage-viewport').parent().innerWidth();
        this.height = $('#garage-viewport').parent().innerHeight();

        this.renderer.setSize( this.width, this.height );
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

    };

    private render () {

        requestAnimationFrame( this.render );
        if ( ! this.garage.isOpened ) return;

        //

        this.lastFrameTime = this.lastFrameTime || Date.now();
        var delta = Date.now() - this.lastFrameTime;
        this.lastFrameTime = Date.now();
        this.timer += delta;

        //

        if ( this.currentTankModel ) {

            this.currentTankModel.rotation.y = this.timer * this.tankRotationSpeed;

        }

        //

        this.renderer.setClearColor( this.background );
        this.renderer.render( this.scene, this.camera );

    };

};

//

export { GarageScene };
