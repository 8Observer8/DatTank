/*
 * @author ohmed
 * DatTank Graphics core
*/

import * as THREE from 'three';

//

enum Quality { LOW = 0.7, MEDIUM = 0.85, HIGH = 1 };

interface GfxSettings {
    quality:    Quality;
    antialias:  boolean;
};

//

class GraphicsCore {

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

        this.resize();

        // setup raycaster

        this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 5000 );

        // setup camera and scene

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 60, this.windowWidth / this.windowHeight, 1, 900 );
        this.scene.add( this.camera );

        // setup lights

        this.sun = new THREE.DirectionalLight( this.lights.sun.color, this.lights.sun.intensity );
        this.sun.position.copy( this.lights.sun.position );
        this.scene.add ( this.sun );
        this.scene.add( new THREE.AmbientLight( this.lights.ambient ) );

        // add fog

        this.scene.fog = new THREE.FogExp2( this.fog.color, this.fog.density );

        // setup sound listener

        this.audioListener = new THREE.AudioListener();
        // if ( soundManager.muted ) this.sound.listener.setMasterVolume( 0 );
        this.camera.add( this.audioListener );

        // user event handlers

        window.addEventListener( 'resize', this.resize.bind( this ) );

        // start rendering

        this.render = this.render.bind( this );
        this.updateRenderer();
        this.render();

    };

    //

    private buildTerrain () {

        // todo

    };

    private addDecorations ( decorations:Array<object> ) {

        for ( var i = 0, il = decorations.length; i < il; i ++ ) {

            let decoration = decorations[ i ];
            // let model = Game.arena.decorationManager.list[ decoration.type ].model;
    
            // let mesh = new THREE.Mesh( model.geometry, [ model.material[0].clone() ] );
            // mesh.material[0].side = THREE.FrontSide;
            // mesh.scale.set( decoration.scale.x, decoration.scale.y, decoration.scale.z );
            // mesh.rotation.y = decoration.rotation;
            // mesh.position.set( decoration.position.x, decoration.position.y, decoration.position.z );
            // mesh.name = decoration.type;
            // view.scene.add( mesh );
            // this.decorations.push( mesh );
    
            // this.addObjectShadow( decoration.type, mesh.position, mesh.scale, mesh.rotation );
    
        }

    };

    private addTeamZones () {

        // todo

    };

    private addGrassZones () {

        // todo

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

    private updateCamera ( position: THREE.Vector3, rotation: number ) {

        this.camera.position.x = position.x - 100 * Math.sin( rotation ) + this.cameraOffset.x;
        this.camera.position.z = position.z - 100 * Math.cos( rotation ) + this.cameraOffset.y;
        this.camera.position.y = 70 + this.cameraOffset.z;
        this.lookAtVector = this.lookAtVector || new THREE.Vector3();
        this.lookAtVector.set( position.x, 40, position.z );
        this.camera.lookAt( this.lookAtVector );

    };

    private animate ( delta: number ) {

        // todo

    };

    private render () {

        this.prevRenderTime = this.prevRenderTime || performance.now();
        let delta = performance.now() - this.prevRenderTime;
        this.prevRenderTime = performance.now();

        this.animate( delta );
        this.renderer.render( this.scene, this.camera );

        //

        requestAnimationFrame( this.render );

    };

    public clear () {

        if (  ! this.scene ) return;

        this.camera.position.y = 400;

        if ( this.shakeInterval !== null ) {

            clearInterval( this.shakeInterval );
            this.shakeInterval = null;

        }

        this.cameraOffset.set( 0, 0, 0 );

        //

        for ( var i = 0, il = this.scene.children.length; i < il; i ++ ) {

            this.scene.remove( this.scene.children[ i ] );

        }

    };

};

//

export { GraphicsCore };
