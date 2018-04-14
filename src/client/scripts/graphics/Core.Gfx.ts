/*
 * @author ohmed
 * DatTank Graphics core
*/

import * as THREE from 'three';

import { Game } from "./../Game";
import { Arena } from "./../core/Arena.Core";
import { LandscapeGfx } from "./objects/Landscape.Gfx";

//

enum Quality { LOW = 0.7, MEDIUM = 0.85, HIGH = 1 };

interface GfxSettings {
    quality:    Quality;
    antialias:  boolean;
};

//

class GraphicsCore {

    private static instance;

    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    private lookAtVector: THREE.Vector3 = new THREE.Vector3();
    private audioListener: THREE.AudioListener;
    private cameraOffset = new THREE.Vector3();
    private shakeInterval: number = null;

    private container;
    private renderer: THREE.WebGLRenderer;
    private raycaster: THREE.Raycaster;
    private prevRenderTime: number;

    private windowWidth: number = 0;
    private windowHeight: number = 0;

    private gfxSettings: GfxSettings = {
        quality:    Quality.MEDIUM,
        antialias:  false
    };

    public decorations: Array<object> = [];
    public sun: THREE.DirectionalLight;
    public landscape: LandscapeGfx = new LandscapeGfx();

    public lights = {
        ambient:    0xfff3bc,
        sun:        {
            color:      0xfff3bc,
            intensity:  0.6,
            position:   new THREE.Vector3( 0, 100, 0 ),
            target:     new THREE.Vector3( 50, 0, 50 )
        }
    };

    public fog = { color: 0xc4c4c2, density: 0.0025 };

    //

    public init () {

        // setup raycaster

        this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 5000 );

        // setup camera and scene

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 60, this.windowWidth / this.windowHeight, 1, 900 );
        this.scene.add( this.camera );

        //

        this.updateRenderer();
        this.resize();

        // setup lights

        this.sun = new THREE.DirectionalLight( this.lights.sun.color, this.lights.sun.intensity );
        this.sun.position.copy( this.lights.sun.position );
        this.scene.add ( this.sun );
        this.scene.add( new THREE.AmbientLight( this.lights.ambient ) );

        // add fog

        this.scene.fog = new THREE.FogExp2( this.fog.color, this.fog.density );

        // init landscape

        this.landscape.init();

        // setup sound listener

        this.audioListener = new THREE.AudioListener();
        // if ( soundManager.muted ) this.sound.listener.setMasterVolume( 0 );
        this.camera.add( this.audioListener );

        // user event handlers

        window.addEventListener( 'resize', this.resize.bind( this ) );

        // start rendering

        this.render = this.render.bind( this );
        this.render();

    };

    //

    public resize () {

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        //

        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.gfxSettings.quality * this.windowWidth, this.gfxSettings.quality * this.windowHeight );

    };

    public updateRenderer () {

        $('#renderport').remove();
        $('#viewport').prepend('<canvas id="renderport"></canvas>');
        this.container = $('#renderport')[0];
        this.renderer = new THREE.WebGLRenderer({ canvas: this.container, antialias: this.gfxSettings.antialias });
        this.renderer.setSize( this.gfxSettings.quality * this.windowWidth, this.gfxSettings.quality * this.windowHeight );
        this.renderer.setClearColor( this.fog.color );

    };

    public addCameraShake ( duration: number, intensity: number ) {

        // todo

    };

    public removeCameraShake () {

        this.camera.position.y = 400;

        if ( this.shakeInterval !== null ) {

            clearInterval( this.shakeInterval );
            this.shakeInterval = null;

        }

        this.cameraOffset.set( 0, 0, 0 );

    };

    private updateCamera ( position, rotation: number ) {

        this.camera.position.x = position.x - 100 * Math.sin( rotation ) + this.cameraOffset.x;
        this.camera.position.z = position.z - 100 * Math.cos( rotation ) + this.cameraOffset.y;
        this.camera.position.y = 70 + this.cameraOffset.z;
        this.lookAtVector = this.lookAtVector || new THREE.Vector3();
        this.lookAtVector.set( position.x, 40, position.z );
        this.camera.lookAt( this.lookAtVector );

    };

    private animate ( time: number, delta: number ) {

        if ( ! Arena.me ) return;

        //

        this.updateCamera( Arena.me.tank.position, Arena.me.tank.rotation );

    };

    private render () {

        let time = performance.now();
        this.prevRenderTime = this.prevRenderTime || time;
        let delta = time - this.prevRenderTime;
        this.prevRenderTime = time;

        this.animate( time, delta );
        this.renderer.render( this.scene, this.camera );

        //

        requestAnimationFrame( this.render );

    };

    public clear () {

        if ( ! this.scene ) return;
        this.removeCameraShake();

        //

        for ( var i = 0, il = this.scene.children.length; i < il; i ++ ) {

            this.scene.remove( this.scene.children[ i ] );

        }

    };

    //

    constructor () {

        if ( GraphicsCore.instance ) {

            return GraphicsCore.instance;

        }

        GraphicsCore.instance = this;

    };

};

//

export let GfxCore = new GraphicsCore();
