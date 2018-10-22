/*
 * @author ohmed
 * DatTank Garage scene
*/

import * as THREE from 'three';

import { ResourceManager } from '../managers/Resource.Manager';
import { Garage } from './Core.Garage';

//

export class GarageScene {

    private container: HTMLCanvasElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    private garage: Garage;

    private models: any[] = [];
    private currentTankModel: THREE.Mesh;

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

    public init ( garage: Garage ) : void {

        this.garage = garage;

        // construct scene & renderer

        this.container = $('#garage-viewport')[0] as HTMLCanvasElement;
        this.width = ( $('#garage-viewport').parent().innerWidth() || 0 ) - 400;
        this.height = ( $('#garage-viewport').parent().innerHeight() || 0 ) - 150;

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

    public initModels () : void {

        if ( Object.keys( this.models ).length !== 0 ) return;

        let model;
        let mesh;
        const textureLoader = new THREE.TextureLoader();

        for ( let i = 0; i < 4; i ++ ) {

            const modelName = ['IS2', 'T29', 'T44', 'T54'][ i ];
            const object = new THREE.Object3D();
            const texture = textureLoader.load( '/resources/textures/' + modelName + '.png' );

            model = ResourceManager.getModel( 'tanks/' + 'IS2' );
            if ( ! model ) continue;

            const material = [
                new THREE.MeshPhongMaterial({ map: texture, color: 0xbbbbbb }),
                new THREE.MeshPhongMaterial({ map: texture, color: 0xbbbbbb }),
                new THREE.MeshPhongMaterial({ map: texture, color: 0xbbbbbb }),
            ];

            mesh = new THREE.Mesh( model.geometry, material );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.scale.set( 0.8, 0.8, 0.8 );
            object.add( mesh );

            this.scene.add( object );
            this.models[ modelName ] = object;
            object.visible = false;

        }

        model = ResourceManager.getModel('Garage');
        if ( ! model ) return;

        mesh = new THREE.Mesh( model.geometry, [ new THREE.MeshPhongMaterial({ color: 0xaaaaaa }) ] );
        mesh.receiveShadow = true;
        this.scene.add( mesh );

        this.garage.onLoadedResources();

    };

    public selectModel ( modelName: string ) : void {

        for ( const model in this.models ) {

            this.models[ model ].visible = false;

        }

        if ( this.models[ modelName ] ) {

            this.models[ modelName ].visible = true;
            this.currentTankModel = this.models[ modelName ];

        }

    };

    public reset () : void {

        if ( ResourceManager.loadedPacks.indexOf('garage') === -1 ) {

            clearTimeout( this.initModelsTimeout );
            this.initModelsTimeout = setTimeout( this.reset.bind( this ), 200 ) as any;
            return;

        }

        $('.garage .play-btn').show();
        $('.garage .loading').hide();

        this.initModels();
        this.camera.position.set( 2, 4.2, 6 );
        this.camera.lookAt( new THREE.Vector3( 0, 0.5, 0 ) );

    };

    public resize () : void {

        this.width = ( $('#garage-viewport').parent().innerWidth() || 0 ) - 400;
        this.height = ( $('#garage-viewport').parent().innerHeight() || 0 ) - 150;

        this.renderer.setSize( this.width, this.height );
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

    };

    private render () : void {

        requestAnimationFrame( this.render );
        if ( ! this.garage.isOpened ) return;

        //

        this.lastFrameTime = this.lastFrameTime || Date.now();
        const delta = Date.now() - this.lastFrameTime;
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
