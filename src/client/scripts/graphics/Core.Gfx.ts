/*
 * @author ohmed
 * DatTank Graphics core
*/

import * as THREE from 'three';

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
import { LargeExplosionManager } from './managers/LargeExplosion.Manager';

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
    private cameraShakeInterval: number | null;

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
    private prevCameraDPos: THREE.Vector3 = new THREE.Vector3();

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

        if ( value === 'HIGH' ) {

            this.gfxSettings.antialias = true;
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
        this.resize();

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
        if ( SoundManager.muted ) this.audioListener.setMasterVolume( 0 );
        this.camera.add( this.audioListener );

        //

        BulletShotManager.init();
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

    public resize () : void {

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        //

        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.gfxSettings.quality * this.windowWidth, this.gfxSettings.quality * this.windowHeight );

    };

    private updateRenderer () : void {

        $('#renderport').remove();
        $('#viewport').prepend('<canvas id="renderport"></canvas>');
        this.container = $('#renderport')[0] as HTMLCanvasElement;
        const params = { powerPreference: 'high-performance', canvas: this.container, antialias: this.gfxSettings.antialias };
        this.renderer = new THREE.WebGLRenderer( params );
        this.renderer.setSize( this.gfxSettings.quality * this.windowWidth, this.gfxSettings.quality * this.windowHeight );
        this.renderer.setClearColor( this.fog.color );

    };

    public addCameraShake ( duration: number, intensity: number ) : void {

        let iter = 0;

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

                if ( this.cameraShakeInterval ) {

                    clearInterval( this.cameraShakeInterval );
                    this.cameraOffset.set( 0, 0, 0 );
                    this.cameraShakeInterval = null;

                }

            }

        }, 40 ) as any;

    };

    public removeCameraShake () : void {

        this.camera.position.y = 400;

        if ( this.cameraShakeInterval !== null ) {

            clearInterval( this.cameraShakeInterval );
            this.cameraShakeInterval = null;

        }

        this.cameraOffset.set( 0, 0, 0 );

    };

    private updateCamera ( position: THREE.Vector3, rotation: number ) : void {

        let x = ( position.x - 90 * Math.sin( rotation ) + this.cameraOffset.x - this.camera.position.x ) / 18;
        let z = ( position.z - 90 * Math.cos( rotation ) + this.cameraOffset.y - this.camera.position.z ) / 18;

        x = 0.2 * x + 0.8 * this.prevCameraDPos.x;
        z = 0.2 * z + 0.8 * this.prevCameraDPos.z;
        this.prevCameraDPos.set( x, 0, z );

        this.camera.position.x = x + this.camera.position.x;
        this.camera.position.y = 50 + this.cameraOffset.z;
        this.camera.position.z = z + this.camera.position.z;

        this.lookAtVector = this.lookAtVector || new THREE.Vector3();
        this.lookAtVector.set( position.x, 40, position.z );
        this.camera.lookAt( this.lookAtVector );

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
        LargeExplosionManager.update( time, delta );
        HealthChangeLabelManager.update( time, delta );
        BulletShotManager.update( time, delta );
        LaserBeamShotManager.update( time, delta );

        this.updateCamera( Arena.me.tank.gfx.object.position, Arena.me.tank.gfx.object.rotation.y );

    };

    private render () : void {

        const time = performance.now();
        this.prevRenderTime = this.prevRenderTime || time;
        const delta = time - this.prevRenderTime;
        this.prevRenderTime = time;

        this.animate( time, delta );
        this.renderer.render( this.scene, this.camera );

        //

        if ( time - this.lastFPSUpdate > 1000 ) {

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

export let GfxCore = new GraphicsCore();
