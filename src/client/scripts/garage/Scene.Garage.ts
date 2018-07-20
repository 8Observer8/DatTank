/*
 * @author ohmed
 * DatTank Garage scene
*/

import * as THREE from 'three';

import { ResourceManager } from "./../managers/Resource.Manager";

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

    private initModelsTimeout: number;
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
        this.width = $('#garage-viewport').parent().innerWidth() - 400;
        this.height = $('#garage-viewport').parent().innerHeight() - 150;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( this.background, 0.035 );
        this.camera = new THREE.PerspectiveCamera( 50, this.width / this.height, 1, 2000 );

        this.renderer = new THREE.WebGLRenderer({ canvas: this.container, antialias: true });
        this.renderer.setSize( this.width, this.height );
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        // construct lights

        this.ambientlight = new THREE.AmbientLight( 0xbbbbbb );
        this.scene.add( this.ambientlight );

        this.spotLight = new THREE.SpotLight( 0x888888, 1, 30, Math.PI / 6, 0.8 );
        this.spotLight.position.set( 2, 7, 2 );
        this.spotLight.lookAt( this.scene.position );
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadow.bias = - 0.0005;
        this.scene.add( this.spotLight );

        //

        window.addEventListener( 'resize', this.resize.bind( this ) );
        this.render = this.render.bind( this );

        //

        this.resize();
        this.render();

    };

    public initModels () {

        if ( Object.keys( this.models ).length !== 0 ) return;

        let model, mesh, texture;
        let textureLoader = new THREE.TextureLoader();

        for ( let i = 0; i < 4; i ++ ) {

            let modelName = ['IS2', 'T29', 'T44', 'T54'][ i ];
            let object = new THREE.Object3D();
            let texture = textureLoader.load( '/resources/textures/' + modelName + '.png' );

            model = ResourceManager.getModel( 'tanks/' + 'IS2' );
            let material = [
                new THREE.MeshPhongMaterial({ map: texture, color: 0xbbbbbb }),
                new THREE.MeshPhongMaterial({ map: texture, color: 0xbbbbbb }),
                new THREE.MeshPhongMaterial({ map: texture, color: 0xbbbbbb })
            ];

            mesh = new THREE.Mesh( model.geometry, material );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.scale.set( 0.8, 0.8, 0.8 );
            object.add( mesh );

            this.scene.add( object );
            this.models[ modelName ] = object;

        }

        model = ResourceManager.getModel('Garage');
        mesh = new THREE.Mesh( model.geometry, [ new THREE.MeshPhongMaterial({ color: 0xaaaaaa }) ] );
        mesh.receiveShadow = true;
        this.scene.add( mesh );

        this.garage.onLoadedResources();

    };

    public selectModel ( modelName: string ) {

        for ( var model in this.models ) {

            this.models[ model ].visible = false;

        }

        this.models[ modelName ].visible = true;
        this.currentTankModel = this.models[ modelName ];

    };

    public reset () {

        if ( ResourceManager.loadedPacks.indexOf('garage') === -1 ) {

            clearTimeout( this.initModelsTimeout );
            this.initModelsTimeout = setTimeout( this.reset.bind( this ), 200 );
            return;

        }

        $('.garage .btn-pick').show();
        $('.garage .characteristics').show();
        $('.garage .loading').hide();

        this.initModels();
        this.camera.position.set( 2, 4.2, 6 );
        this.camera.lookAt( new THREE.Vector3( 0, 0.5, 0 ) );

    };

    public resize ( event? ) {

        this.width = $('#garage-viewport').parent().innerWidth() - 400;
        this.height = $('#garage-viewport').parent().innerHeight() - 150;

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
