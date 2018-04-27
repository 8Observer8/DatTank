/*
 * @author ohmed
 * DatTank Graphics core
*/

import * as THREE from 'three';

import { Game } from "./../Game";
import { Arena } from "./../core/Arena.Core";
import { LandscapeGfx } from "./objects/Landscape.Gfx";

import { BoxManager } from "./../managers/Box.Manager";
import { TowerManager } from "./../managers/Tower.Manager";
import { DecorationManager } from "./../managers/Decoration.Manager";
import { ControlsManager } from "./../managers/Control.Manager";
import { ExplosionManager } from "./../managers/Explosion.Manager";
import { HealthChangeLabelManager } from "./../managers/HealthChangeLabel.Manager";
import { BulletManager } from '../managers/Bullet.Manager';
import { LargeExplosionManager } from '../managers/LargeExplosion.Manager';

//

enum Quality { LOW = 0.6, MEDIUM = 0.85, HIGH = 1 };

interface GfxSettings {
    quality:    Quality;
    antialias:  boolean;
};

//

class GraphicsCore {

    private static instance: GraphicsCore;

    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    private lookAtVector: THREE.Vector3 = new THREE.Vector3();
    private cameraOffset = new THREE.Vector3();
    private cameraShakeInterval: number;

    private container;
    private renderer: THREE.WebGLRenderer;
    private raycaster: THREE.Raycaster;
    private prevRenderTime: number;

    private gfxSettings: GfxSettings = {
        quality:    Quality.MEDIUM,
        antialias:  false
    };

    public windowWidth: number = 0;
    public windowHeight: number = 0;

    public audioListener: THREE.AudioListener;
    public decorations: Array<object> = [];
    public sun: THREE.DirectionalLight;
    public landscape: LandscapeGfx = new LandscapeGfx();
    public coreObjects = {};

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

    public setQuality ( value ) {

        if ( value === 'HIGH' ) {

            this.gfxSettings.antialias = true;
            this.gfxSettings.quality = Quality.HIGH;

        } else if ( value === 'LOW' ) {

            this.gfxSettings.antialias = false;
            this.gfxSettings.quality = Quality.LOW;

        }

        GfxCore.updateRenderer();

    };

    public init () {

        if ( this.scene ) {

            console.warn( 'GfxCore already inited!' );
            return;

        }

        // setup raycaster

        this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 5000 );

        // setup camera and scene

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 60, this.windowWidth / this.windowHeight, 1, 900 );
        this.camera.name = 'MainCamera';
        this.scene.add( this.camera );

        //

        this.updateRenderer();
        this.resize();

        // setup lights

        let ambientLight = new THREE.AmbientLight( this.lights.ambient );
        ambientLight.name = 'GlobalAmbientLight';
        this.sun = new THREE.DirectionalLight( this.lights.sun.color, this.lights.sun.intensity );
        this.sun.name = 'GlobalSunLight';
        this.sun.position.copy( this.lights.sun.position );
        this.scene.add ( this.sun );
        this.scene.add( ambientLight );

        // add fog

        this.scene.fog = new THREE.FogExp2( this.fog.color, this.fog.density );

        // init landscape

        this.landscape.init();

        // setup sound listener

        this.audioListener = new THREE.AudioListener();
        // if ( soundManager.muted ) this.sound.listener.setMasterVolume( 0 );
        this.camera.add( this.audioListener );

        //

        BulletManager.init();
        LargeExplosionManager.init();
        ExplosionManager.init();
        HealthChangeLabelManager.init();

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

    private updateRenderer () {

        $('#renderport').remove();
        $('#viewport').prepend('<canvas id="renderport"></canvas>');
        this.container = $('#renderport')[0];
        this.renderer = new THREE.WebGLRenderer({ canvas: this.container, antialias: this.gfxSettings.antialias });
        this.renderer.setSize( this.gfxSettings.quality * this.windowWidth, this.gfxSettings.quality * this.windowHeight );
        this.renderer.setClearColor( this.fog.color );

    };

    public addCameraShake ( duration: number, intensity: number ) {

        var iter = 0;
    
        if ( this.cameraShakeInterval !== null ) {
    
            clearInterval( this.cameraShakeInterval );
            this.cameraOffset.set( 0, 0, 0 );
    
        }

        this.cameraShakeInterval = setInterval( () => {

            this.cameraOffset.x = intensity * ( Math.random() - 0.5 ) * iter / 2;
            this.cameraOffset.y = intensity * ( Math.random() - 0.5 ) * iter / 2;
            this.cameraOffset.z = intensity * ( Math.random() - 0.5 ) * iter / 2;
    
            iter ++;
    
            if ( iter > Math.floor( ( duration - 100 ) / 40 ) ) {
    
                clearInterval( this.cameraShakeInterval );
                this.cameraOffset.set( 0, 0, 0 );
                this.cameraShakeInterval = null;
    
            }
    
        }, 40 );

    };

    public removeCameraShake () {

        this.camera.position.y = 400;

        if ( this.cameraShakeInterval !== null ) {

            clearInterval( this.cameraShakeInterval );
            this.cameraShakeInterval = null;

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

        BoxManager.update( time, delta );
        TowerManager.update( time, delta );
        DecorationManager.update( time, delta );
        ControlsManager.update( time, delta );
        ExplosionManager.update( time, delta );
        LargeExplosionManager.update( time, delta );
        HealthChangeLabelManager.update( time, delta );
        BulletManager.update( time, delta );

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
