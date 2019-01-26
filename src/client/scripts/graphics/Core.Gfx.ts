/*
 * @author ohmed
 * DatTank Graphics core
*/

import * as THREE from 'three';

import { Logger } from '../utils/Logger';
import { UI } from '../ui/Core.UI';
import { Arena } from '../core/Arena.Core';
import { LandscapeGfx } from './objects/Landscape.Gfx';

import { PlayerManager } from '../managers/arena/Player.Manager';
import { SoundManager } from '../managers/other/Sound.Manager';
import { BoxManager } from '../managers/objects/Box.Manager';
import { TowerManager } from '../managers/objects/Tower.Manager';
import { DecorationManager } from '../managers/objects/Decoration.Manager';
import { ControlsManager } from '../managers/other/Control.Manager';
import { ExplosionManager } from './managers/Explosion.Manager';
import { HealthChangeLabelManager } from './managers/HealthChangeLabel.Manager';
import { BulletShotManager } from './managers/BulletShot.Manager';
import { LaserBeamShotManager } from './managers/LaserBeamShot.Manager';
import { DeathExplosionManager } from './managers/DeathExplosion.Manager';

//

enum Quality { LOW = 0.6, MEDIUM = 0.85, HIGH = 0.9 };

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

    public container: HTMLCanvasElement;
    public renderer: THREE.WebGLRenderer;
    private prevRenderTime: number;

    private gfxSettings: GfxSettings = {
        quality:    Quality.MEDIUM,
        antialias:  false,
    };

    public windowWidth: number = 0;
    public windowHeight: number = 0;

    public audioListener: THREE.AudioListener;
    public decorations: object[] = [];
    public sun: THREE.DirectionalLight;
    public landscape: LandscapeGfx = new LandscapeGfx();
    public coreObjects = {};

    private frames: number = 0;
    private lastFPSUpdate: number = 0;
    private lastGAStats: number = 0;

    private cameraShakeIntensity: number = 0;
    private cameraShakeTime: number = 0;

    public effectComposer: any;
    private fxaaPass: any;
    private renderPass: any;

    public lights = {
        ambient:    0xf9f9f9,
        sun:        {
            color:      0xf4f3eb,
            intensity:  0.4,
            position:   new THREE.Vector3( 0, 100, 0 ),
            target:     new THREE.Vector3( 50, 0, 50 ),
        },
    };

    public fog = { color: 0xc4c4c2, density: 0.0025 };

    //

    public setQuality ( value: string ) : void {

        if ( ! this.renderer ) return;

        if ( value === 'HIGH' ) {

            this.gfxSettings.antialias = false;
            this.gfxSettings.quality = Quality.HIGH;

        } else if ( value === 'LOW' ) {

            this.gfxSettings.antialias = false;
            this.gfxSettings.quality = Quality.LOW;

        }

        GfxCore.updateRenderer();

    };

    public init () : void {

        if ( this.scene ) {

            console.warn( 'GfxCore already inited!' );
            return;

        }

        // setup camera and scene

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 60, this.windowWidth / this.windowHeight, 1, 900 );
        this.camera.name = 'MainCamera';
        this.scene.add( this.camera );
        this.scene.autoUpdate = false;

        //

        this.updateRenderer();

        // setup lights

        const ambientLight = new THREE.AmbientLight( this.lights.ambient );
        ambientLight.name = 'GlobalAmbientLight';
        this.sun = new THREE.DirectionalLight( this.lights.sun.color, this.lights.sun.intensity );
        this.sun.name = 'GlobalSunLight';
        this.sun.position.copy( this.lights.sun.position );
        this.sun.updateMatrixWorld( true );
        this.scene.add ( this.sun );
        this.scene.add( ambientLight );

        // add fog

        this.scene.fog = new THREE.FogExp2( this.fog.color, this.fog.density );

        // init landscape

        this.landscape.init();

        // setup sound listener

        this.audioListener = new THREE.AudioListener();
        this.camera.add( this.audioListener );
        if ( SoundManager.muted ) this.audioListener.setMasterVolume( 0 );

        //

        BulletShotManager.init();
        DeathExplosionManager.init();
        ExplosionManager.init();
        HealthChangeLabelManager.init();

        // user event handlers

        window.addEventListener( 'resize', this.resize.bind( this ) );

        // start rendering

        this.render = this.render.bind( this );
        this.render();

    };

    //

    public resize () : void {

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        //

        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.gfxSettings.quality * this.windowWidth, this.gfxSettings.quality * this.windowHeight );
        this.fxaaPass.uniforms.resolution.value.set( 1 / this.windowWidth, 1 / this.windowHeight );
        this.fxaaPass.uniforms.tDiffuse.value = null;
        this.effectComposer.setSize( this.windowWidth, this.windowHeight );

    };

    private updateRenderer () : void {

        $('#renderport').remove();
        $('#viewport').prepend('<canvas id="renderport"></canvas>');
        this.container = $('#renderport')[0] as HTMLCanvasElement;
        const params = { powerPreference: 'high-performance', canvas: this.container, antialias: this.gfxSettings.antialias };
        this.renderer = new THREE.WebGLRenderer( params );
        this.renderer.setPixelRatio( 1 );
        this.renderer.setClearColor( this.fog.color );
        this.renderer.autoClear = false;

        // composer

        this.renderPass = new THREE.RenderPass( this.scene, this.camera );
        this.fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
        this.fxaaPass.renderToScreen = true;

        this.effectComposer = new THREE.EffectComposer( this.renderer );
        this.effectComposer.addPass( this.renderPass );
        this.effectComposer.addPass( this.fxaaPass );

        //

        this.resize();

    };

    public addCameraShake ( duration: number, intensity: number ) : void {

        this.cameraShakeTime = duration;
        this.cameraShakeIntensity = intensity;

    };

    public removeCameraShake () : void {

        this.cameraShakeIntensity = 0;
        this.cameraShakeTime = 0;
        this.camera.position.y = 400;
        this.cameraOffset.set( 0, 0, 0 );

    };

    private updateCamera ( delta: number, position: THREE.Vector3, rotation: number ) : void {

        const dX = ( position.x - 100 * Math.sin( rotation ) + this.cameraOffset.x - this.camera.position.x ) / 7;
        const dZ = ( position.z - 100 * Math.cos( rotation ) + this.cameraOffset.y - this.camera.position.z ) / 7;

        const x: number = Math.sign( dX ) * Math.min( 7 * Math.abs( dX ), Math.abs( dX ) * delta / 16 );
        const z: number = Math.sign( dZ ) * Math.min( 7 * Math.abs( dZ ), Math.abs( dZ ) * delta / 16 );

        this.camera.position.x = x + this.camera.position.x;
        this.camera.position.y = 60 + this.cameraOffset.z;
        this.camera.position.z = z + this.camera.position.z;

        this.lookAtVector = this.lookAtVector || new THREE.Vector3();
        this.lookAtVector.set( position.x, 40, position.z );
        this.camera.lookAt( this.lookAtVector );

        // apply camera shake

        if ( this.cameraShakeTime > 0 ) {

            this.cameraOffset.x = ( delta / 16 ) * this.cameraShakeIntensity * ( Math.random() - 0.5 ) * this.cameraShakeTime / delta;
            this.cameraOffset.y = ( delta / 16 ) * this.cameraShakeIntensity * ( Math.random() - 0.5 ) * this.cameraShakeTime / delta;
            this.cameraOffset.z = ( delta / 16 ) * this.cameraShakeIntensity * ( Math.random() - 0.5 ) * this.cameraShakeTime / delta;
            this.cameraShakeTime = ( this.cameraShakeTime - delta > 0 ) ? this.cameraShakeTime - delta : 0;

        }

        //

        this.camera.updateMatrixWorld( true );

    };

    private animate ( time: number, delta: number ) : void {

        if ( ! Arena.me || ! Arena.me.tank ) return;

        //

        PlayerManager.update( time, delta );

        BoxManager.update( time, delta );
        TowerManager.update( time, delta );
        DecorationManager.update( time, delta );
        ControlsManager.update( time, delta );
        ExplosionManager.update( time, delta );
        DeathExplosionManager.update( time, delta );
        HealthChangeLabelManager.update( time, delta );
        BulletShotManager.update( time, delta );
        LaserBeamShotManager.update( time, delta );

        this.updateCamera( delta, Arena.me.tank.gfx.object.position, Arena.me.tank.gfx.object.rotation.y );

    };

    private render () : void {

        const time = performance.now();
        this.prevRenderTime = this.prevRenderTime || time;
        const delta = time - this.prevRenderTime;
        this.prevRenderTime = time;

        this.animate( time, delta );

        this.effectComposer.render();

        //

        if ( time - this.lastFPSUpdate > 1000 ) {

            this.lastGAStats = this.lastGAStats || time;

            if ( time - this.lastGAStats > 60 * 1000 ) {

                Logger.newEvent( ( 10 * Math.round( this.frames / 10 ) ).toString() + 'fps', 'fps-stats' );
                this.lastGAStats = time + 20 * 60 * 1000;

            }

            UI.InGame.updateFPS( this.frames );
            this.lastFPSUpdate = time;
            this.frames = 0;

        }

        this.frames ++;

        //

        requestAnimationFrame( this.render );

    };

    public clear () : void {

        if ( ! this.scene ) return;
        this.removeCameraShake();

        //

        for ( let i = 0, il = this.scene.children.length; i < il; i ++ ) {

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

window['THREE'] = THREE;

export let GfxCore = new GraphicsCore();
