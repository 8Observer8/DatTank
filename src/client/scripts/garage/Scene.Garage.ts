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
    private currentModel: THREE.Object3D = new THREE.Object3D();
    private baseModel: THREE.Mesh;
    private cannonModel: THREE.Mesh;

    private ambientLight: THREE.AmbientLight;
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
        this.width = ( $('#garage-viewport').parent().innerWidth() || 0 );
        this.height = ( $('#garage-viewport').parent().innerHeight() || 0 ) - 130;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( this.background, 0.035 );
        this.camera = new THREE.PerspectiveCamera( 50, this.width / this.height, 1, 2000 );

        this.renderer = new THREE.WebGLRenderer({ canvas: this.container, antialias: true });
        this.renderer.setSize( this.width, this.height );
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        // construct lights

        this.ambientLight = new THREE.AmbientLight( 0xbbbbbb );
        this.scene.add( this.ambientLight );

        this.spotLight = new THREE.SpotLight( 0x888888, 1, 300, Math.PI / 3, 0.5 );
        this.spotLight.position.set( 2, 7, 2 );
        this.spotLight.lookAt( this.scene.position );
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadow.bias = - 0.0005;
        this.scene.add( this.spotLight );

        //

        this.scene.add( this.currentModel );

        //

        window.addEventListener( 'resize', this.resize.bind( this ) );
        this.render = this.render.bind( this );

        //

        this.resize();
        this.render();

    };

    public selectTank ( modelName: string ) : void {

        this.currentModel.remove( this.baseModel );

        const model = ResourceManager.getModel( 'bases/' + modelName );
        if ( ! model ) return;

        this.baseModel = new THREE.Mesh( model.geometry, [
            new THREE.MeshLambertMaterial({ color: 0xaaaaaa, map: new THREE.TextureLoader().load('/resources/textures/IS2.png') }),
            new THREE.MeshLambertMaterial({ color: 0xaaaaaa, map: new THREE.TextureLoader().load('/resources/textures/IS2.png') }),
            new THREE.MeshLambertMaterial({ color: 0xaaaaaa, map: new THREE.TextureLoader().load('/resources/textures/IS2.png') }),
        ]);
        this.baseModel.castShadow = true;
        this.baseModel.receiveShadow = true;
        this.baseModel.scale.set( 0.8, 0.8, 0.8 );

        this.currentModel.add( this.baseModel );

    };

    public selectCannon ( modelName: string ) : void {

        this.currentModel.remove( this.cannonModel );

        const model = ResourceManager.getModel( 'cannons/' + modelName );
        if ( ! model ) return;

        this.cannonModel = new THREE.Mesh( model.geometry, [
            new THREE.MeshLambertMaterial({ color: 0xaaaaaa, map: new THREE.TextureLoader().load('/resources/textures/IS2.png') }),
        ]);
        this.cannonModel.castShadow = true;
        this.cannonModel.receiveShadow = true;
        this.cannonModel.scale.set( 0.8, 0.8, 0.8 );

        this.currentModel.add( this.cannonModel );

    };

    public reset () : void {

        if ( ResourceManager.loadedPacks.indexOf('garage') === -1 ) {

            clearTimeout( this.initModelsTimeout );
            this.initModelsTimeout = setTimeout( this.reset.bind( this ), 200 ) as any;
            return;

        }

        //

        const model = ResourceManager.getModel('Garage')!;
        const mesh = new THREE.Mesh( model.geometry, [
            new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: new THREE.TextureLoader().load( '/resources/textures/garage-wall1.jpg' ) }),
            new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: new THREE.TextureLoader().load( '/resources/textures/garage-wall2.jpg' ) }),
            new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: new THREE.TextureLoader().load( '/resources/textures/garage-ground1.jpg' ) }),
            new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: new THREE.TextureLoader().load( '/resources/textures/garage-ceiling.jpeg' ) }),
            new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: new THREE.TextureLoader().load( '/resources/textures/garage-ground2.jpg' ) }),
        ] );

        mesh.material[0].map.wrapS = mesh.material[0].map.wrapT = THREE.RepeatWrapping;
        mesh.material[1].map.wrapS = mesh.material[1].map.wrapT = THREE.RepeatWrapping;
        mesh.material[2].map.wrapS = mesh.material[2].map.wrapT = THREE.RepeatWrapping;
        mesh.material[3].map.wrapS = mesh.material[3].map.wrapT = THREE.RepeatWrapping;
        mesh.material[4].map.wrapS = mesh.material[4].map.wrapT = THREE.RepeatWrapping;

        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.scale.set( 5, 5, 5 );
        mesh.position.y = 0.69;
        this.scene.add( mesh );

        //

        $('.garage .play-btn').show();
        $('.garage .loading').hide();

        this.garage.onLoadedResources();
        this.camera.position.set( 6, 3.2, -8 );
        this.camera.lookAt( new THREE.Vector3( 0, 1.5, 0 ) );

    };

    public resize () : void {

        this.width = ( $('#garage-viewport').parent().innerWidth() || 0 );
        this.height = ( $('#garage-viewport').parent().innerHeight() || 0 ) - 130;

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

        if ( this.currentModel ) {

            this.currentModel.rotation.y = this.timer * this.tankRotationSpeed;

        }

        //

        this.renderer.setClearColor( this.background );
        this.renderer.render( this.scene, this.camera );

    };

};
